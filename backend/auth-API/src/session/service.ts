import { UnauthorizedError, EmailConfirmError, TwoFaError } from '@transcenduck/error'
import crypto from 'crypto';

import { generateToken } from "../utils/jwt.js";
import { refreshTokenModelInstance } from "./model.js";

import { FamiliesResponseType } from './schema.js';
import { redisPub } from '../utils/redis.js';

import { TwoFaService, generateCode } from '../twofa/service.js';

interface refreshTokenInfo {
  user_id: string;
  family_id: string;
  device_id: string;
  ip_address: string;
  user_agent: string;
}

interface clientInfo {
  device_id: string;
  ip_address: string;
  user_agent: string;
}

async function createRefreshToken(clientInformation: refreshTokenInfo): Promise<string> {
  const session = {
    id: 'rt_' + crypto.randomBytes(16).toString('hex'),
    family_id: clientInformation.family_id, //
    user_id: clientInformation.user_id,
    device_id: clientInformation.device_id, // si tu as un device_id on refile un fucking cookie
    ip_address: clientInformation.ip_address, // 
    user_agent: clientInformation.user_agent, //
  }

  await refreshTokenModelInstance.createToken(session);
  return session.id;
}

async function createAccessToken(id: string, jti: string): Promise<string> {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT secret is not defined');
  }
  const payload = {
    sub: id,
    iss: 'Transcenduck-ISS-Api',
    aud: 'Transcenduck-App',
    exp: Math.floor(Date.now() / 1000) + (parseInt(process.env.JWT_ACCESS_TOKEN_EXPIRES_IN || '600')), // Default to 10 minutes
    iat: Math.floor(Date.now() / 1000),
    jti: 'jti_' + jti, //  JTI to family 
  }
  return generateToken(payload, secret);
}

async function verifyCredentials(username: string, password: string): Promise<{ id: string; family_id: string;}> {
  const response = await fetch(`http://${process.env.USER_IP}/internal/users/authentications`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })

  if (!response.ok) {
    if (response.status === 461) {
      throw new EmailConfirmError();
    }
    throw new UnauthorizedError();
  }

  const user_data = await response.json() as any;

  return user_data.data;
}

export interface userIds {
  id : string,
  family_id: string
}

export interface userInfos {
  email: string,
  password: string,
  validated: boolean,
  twofa: boolean,
  id: string,
  username: string,
  created_at: string,
  preferences?: {
    theme: 'dark' | 'light',
    lang: 'en' | 'fr' | 'es',
    avatar: string,
    banner: string
  }
}

export class SessionService {

  static async createSession(user: userIds, clientInfo?: clientInfo) {
    const family_id = crypto.randomBytes(16).toString('hex');

    const accessToken = await createAccessToken(user.id, family_id);

    const refreshToken = await createRefreshToken({
      user_id: user.id,
      family_id: family_id,
      device_id: clientInfo!.device_id,
      ip_address: clientInfo!.ip_address,
      user_agent: clientInfo!.user_agent,
    })

    return { accessToken, refreshToken };
  }

  static async login(data: {username?: string, password?: string, email?: string, avatar?: string}, clientInfo: clientInfo, o2aut: boolean = false) {
    let userInfo;
    if (!o2aut && data.password !== undefined) {
      userInfo = await verifyCredentials(data.username!, data.password);
    } else if (o2aut) {
      userInfo = (await (await fetch(`http://${process.env.USER_IP}/internal/users/oauth2`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: data.username,
          email: data.email,
          avatar: data.avatar
        })
      })).json()).data;
    }
    if(!userInfo){
      throw new UnauthorizedError('Username and password are required for login');
    }
    const preferences = (await (await fetch(`http://${process.env.USER_IP}/users/${userInfo.id}/preferences`)).json());
    console.log(preferences);
    if (userInfo.validated === false) {
      TwoFaService.generateSendToken(userInfo.email, preferences!.lang);
      throw new EmailConfirmError()
    }

    if (userInfo.twofa === false) {
      return this.createSession(userInfo, clientInfo);
    }

    const family_id = crypto.randomBytes(16).toString('hex');

    const email = userInfo.email;
    const lang = preferences?.lang;
    const code = generateCode();
    
    await TwoFaService.generateSendCode(email, lang, code)
    
    redisPub.setEx('users:userIds:' + code + ':userId', 600, userInfo.id);
    redisPub.setEx('users:userIds:' + code + ':family_id', 600, family_id);
    throw new TwoFaError();
  }

  static async login2FA (code: string, clientInfo?: clientInfo) {
    await TwoFaService.verifyCode(code);

    const id = await redisPub.get('users:userIds:' + code + ':userId');
    const family_id = await redisPub.get('users:userIds:' + code + ':family_id');

    const multi = redisPub.multi();
    multi.del('users:userIds:' + code + ':userId');
    multi.del('users:userIds:' + code + ':family_id');
    await multi.exec();
    return await this.createSession({ id, family_id } as userIds, clientInfo)
  } 

  static async refreshToken(tokenId: string) {

    const token = await refreshTokenModelInstance.getTokenById(tokenId);
    if (!token) throw new UnauthorizedError();

    if (!token.is_active) throw new UnauthorizedError('Token is not active');
    if (token.expired_at! < Date.now().toString()) throw new UnauthorizedError('Token has expired');

    // Update last used time
    await refreshTokenModelInstance.updateToken(tokenId, { last_used: Date.now().toString(), is_active: false });

    const accessToken = await createAccessToken(token.user_id, token.family_id);

    const refreshToken = await createRefreshToken({ // TODO : gerer les device_id, ip_adress, et user_agent
      user_id: token.user_id,
      family_id: token.family_id,
      device_id: token.device_id,
      ip_address: token.ip_address,
      user_agent: token.user_agent,
    });

    return { accessToken, refreshToken };
  }

  static async logout(tokenId: string) {
    const token = await refreshTokenModelInstance.getTokenById(tokenId);
    if (!token) throw new UnauthorizedError();
    if (!token.is_active) throw new UnauthorizedError('Token is not active');
    return await refreshTokenModelInstance.updateAllTokensByFamilyIdActive(token.family_id, {
        is_active: false,
        last_used: Date.now().toString(),
      })
  }

  static async deleteFamily(familyId: string) {
    return await refreshTokenModelInstance.deleteAllTokensByFamilyId(familyId);
  }

  static async getFamilies(userId: string): Promise<FamiliesResponseType> {
    return await refreshTokenModelInstance.getAllFamiliesByUserId(userId);
  }

  static async deleteById(userId: string) {
    return await refreshTokenModelInstance.deleteAllTokensByUserId(userId);         
  }

  static async getFamilyById(familyId: string): Promise<FamiliesResponseType> {
    return await refreshTokenModelInstance.getAllTokensByFamilyId(familyId);
  }
}




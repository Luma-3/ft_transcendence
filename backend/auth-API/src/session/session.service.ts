import { UnauthorizedError, EmailConfirmError, TwoFaError } from '@transcenduck/error'
import crypto from 'crypto';

import { generateToken } from "../utils/jwt.js";
import { refreshTokenModelInstance } from "./token.model.js";

import { FamiliesResponseType } from './session.schema.js';
import { redisPub } from '../utils/redis.js';

import { twoFaService, generateCode } from '../2FA/twofa.service.js';

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
  const response = await fetch(`http://${process.env.USER_IP}/users/internal/authentications`, {
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
  google_id?: string,
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

  static async login(infoUser: {username?: string, password?: string, email?: string}, clientInfo: clientInfo, o2aut: boolean = false) {
    let user;
    if (!o2aut && infoUser.password !== undefined) {
      user = await verifyCredentials(infoUser.username!, infoUser.password);
    }else if(o2aut){
      user = await (await fetch(`http://${process.env.USER_IP}/users/internal/oauth2`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: infoUser.username,
          email: infoUser.email,
        })
      })).json();
    console.log(user);
    } else if(!user){
      throw new UnauthorizedError('Username and password are required for login');
    }
      
    const userInfosRequest = await fetch('http://' + process.env.USER_IP + '/internal/users/' + user.id + '?includePreferences=true', {
      method: 'GET'
    })

    const userInfo = (await userInfosRequest.json()).data as userInfos;

    if (userInfo.validated === false) {
      twoFaService.generateSendToken(userInfo.email, userInfo.preferences?.lang ?? 'en');
      throw new EmailConfirmError()
    }

    if (userInfo.twofa === false) {
      return this.createSession(user, clientInfo);
    }
    const family_id = crypto.randomBytes(16).toString('hex');

    const email = userInfo.email;
    const lang = userInfo.preferences!.lang;
    const code = generateCode();
    
    await twoFaService.generateSendCode(email, lang, code)
    
    redisPub.setEx('users:userIds:' + code + ':userId', 600, user.id)
    redisPub.setEx('users:userIds:' + code + ':family_id', 600, family_id)
    throw new TwoFaError();
  }

  static async login2FA (code: string, clientInfo?: clientInfo) {
    await twoFaService.verifyCode(code);

    const id = await redisPub.get('users:userIds:' + code + ':userId');
    const family_id = await redisPub.get('users:userIds:' + code + ':family_id');

    await redisPub.del('users:userIds:' + code + ':userId');
    await redisPub.del('users:userIds:' + code + ':family_id');

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

  static async deleteFamily(familyId: string) {
    return await refreshTokenModelInstance.deleteAllTokensByFamilyId(familyId);
  }

  static async getFamilies(userId: string): Promise<FamiliesResponseType> {
    return await refreshTokenModelInstance.getAllFamiliesByUserId(userId);
  }

  static async getFamilyById(familyId: string): Promise<FamiliesResponseType> {
    return await refreshTokenModelInstance.getAllTokensByFamilyId(familyId);
  }
}




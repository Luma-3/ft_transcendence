import { UnauthorizedError, EmailConfirmError } from '@transcenduck/error'
import crypto from 'crypto';

import { generateToken } from "../utils/jwt.js";
import { refreshTokenModelInstance } from "./token.model.js";

import { FamiliesResponseType } from './session.schema.js';

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

async function verifyCredentials(username: string, password: string): Promise<{ id: string; family_id: string }> {
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

  const user_data = await response.json();

  return user_data.data;
}

export class SessionService {
  static async login(username: string, password?: string, clientInfo?: clientInfo): Promise<{ accessToken: string; refreshToken: string }> {
    let user;

    if (password !== undefined) {
      user = await verifyCredentials(username, password);
    }
    if (!user) {
      throw new UnauthorizedError('Invalid username or password');
    }
    console.log("USER Data: ", user);

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




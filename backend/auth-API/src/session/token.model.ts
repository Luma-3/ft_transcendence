import { Knex } from 'knex';
import { knexInstance } from '../utils/knex.js';
import { FamiliesResponseType, RefreshTokenBaseType } from './session.schema.js';

class RefreshTokenModel {
  constructor(public knex: Knex) { }

  async createToken(tokenData: RefreshTokenBaseType): Promise<void> {
    const { id, family_id, user_id, device_id, ip_address, user_agent } = tokenData;

    await this.knex('token').insert({
      id: id,
      user_id: user_id,
      family_id: family_id,
      device_id: device_id,
      ip_address: ip_address,
      user_agent: user_agent,
      created_at: new Date(),
      expired_at: new Date(process.env.JWT_REFRESH_TOKEN_EXPIRES_IN
        ? Date.now() + parseInt(process.env.JWT_REFRESH_TOKEN_EXPIRES_IN) * 1000
        : Date.now() + 7 * 24 * 60 * 60 * 1000), // Default to 7 days
      last_used: null,
      is_active: true,
    });
  }

  async getTokenById(sessionId: string): Promise<RefreshTokenBaseType | undefined> {
    return this.knex('token').where({ id: sessionId }).select('*').first();
  }

  async getAllTokensByFamilyId(family_id: string): Promise<FamiliesResponseType> {
    return this.knex('token').where({ family_id: family_id }).select('*');
  }

  async getAllFamiliesByUserId(userId: string): Promise<FamiliesResponseType> {
    return this.knex('token').where({ user_id: userId }).select('*');
  }

  async updateToken(sessionId: string, updates: Partial<RefreshTokenBaseType>): Promise<void> {
    await this.knex('token').where({ id: sessionId }).update(updates);
  }

  async updateAllTokensByFamilyId(family_id: string, updates: Partial<RefreshTokenBaseType>): Promise<void> {
    await this.knex('token').where({ family_id }).update(updates);
  }

  async updateAllTokensByFamilyIdActive(family_id: string, updates: Partial<RefreshTokenBaseType>): Promise<void> {
    await this.knex('token').where({ family_id, is_active: true }).update(updates);
  }

  async deleteTokenById(sessionId: string): Promise<void> {
    await this.knex('token').where({ id: sessionId }).delete();
  }

  async deleteAllTokensByFamilyId(family_id: string): Promise<void> {
    await this.knex('token').where({ family_id }).delete();
  }

  async deleteAllTokensByUserId(userId: string): Promise<void> {
    await this.knex('token').where({ user_id: userId }).delete();
  }

}

export const refreshTokenModelInstance = new RefreshTokenModel(knexInstance);


/*

User : [Sessions[family_id, {Token[]}]]


Session :
  family_id : (id unique de la session)

Map Token : [
  ...
  [OLD] refresh Token
  [Current] refresh Token
]

Refresh Token : {
  user_id: 
  family_id:  identifiant de la famille de token
}

Access Token : {
  jti : identifiant (family_id)
}

\-


*/

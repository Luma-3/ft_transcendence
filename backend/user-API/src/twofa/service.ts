import { NotFoundError } from "@transcenduck/error";

import { USER_PRIVATE_COLUMNS, userModelInstance } from "../users/model.js";
import { User2faStatusType } from "./schema.js";
import { UserService } from "../users/service.js";
import { PREFERENCES_PRIVATE_COLUMNS } from "../preferences/model.js";
import { redisCache } from "../utils/redis.js";

import fetch from "node-fetch";
import https from "https"

const httpsAgent = new https.Agent({ rejectUnauthorized: false })

export class twofaService {
	static async activateUserAccount(email: string) {
		const user = await userModelInstance.findByEmail(email);
		if (!user) {
			throw new NotFoundError('User');
		}
		await userModelInstance.update(user.id, { validated: true }, USER_PRIVATE_COLUMNS);
	}

	static async get2faStatus(userId: string): Promise<User2faStatusType> {
		const user = await userModelInstance.findByID(userId, ['twofa']);
		if (!user) {
			throw new NotFoundError('User');
		}
		return { twofa: user.twofa };
	}

	static async enable2FA(userId: string) {
    const user = await UserService.getUserByID(userId, true, USER_PRIVATE_COLUMNS, PREFERENCES_PRIVATE_COLUMNS);
    if (!user) {
      throw new NotFoundError('User');
    }

    await fetch(`https://${process.env.AUTH_IP}/internal/2fa/code`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'accept': 'application/json'
      },
      body: JSON.stringify({ email: user.email, lang: user.preferences?.lang }),
      agent: httpsAgent
    }).catch(console.error)

    redisCache.setEx("users:2fa:update:" + user.email , 600, userId);
  }

  static async disable2FA(userId: string) {
    const user = await UserService.getUserByID(userId, true, USER_PRIVATE_COLUMNS, PREFERENCES_PRIVATE_COLUMNS);
    if (!user) {
      throw new NotFoundError('User');
    }

    await fetch(`https://${process.env.AUTH_IP}/internal/2fa/code`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'accept': 'application/json'
      },
      body: JSON.stringify({ email: user.email, lang: user.preferences?.lang }),
      agent: httpsAgent
    }).catch(console.error)

    redisCache.setEx("users:2fa:update:" + user.email, 600, userId);
  }

  static async update2FA(userId: string) {
    const user = await userModelInstance.findByID(userId, USER_PRIVATE_COLUMNS);
    const twofa = user!.twofa;
    await userModelInstance.update(userId, { twofa: !twofa }, USER_PRIVATE_COLUMNS);
    if ((!twofa) === true) {
      return "2FA successfully enabled !";
    }
    return "2FA successfully disabled !"
  }
}
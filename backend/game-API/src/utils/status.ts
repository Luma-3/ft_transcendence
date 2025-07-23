import { redisCache } from "../utils/redis.js";

export class UserStatus {

    static async isUserOnline(userId: string) {
        return (await redisCache.sCard('sockets:' + userId) as number) > 0;
    }


}



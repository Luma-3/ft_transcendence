import { BlockedService } from "./services.js";
import { FastifyReply, FastifyRequest } from "fastify";
import { BlockedParamType, HydrateDBQueryType, UserHeaderIdType } from "./schema.js";
import { redisCache } from "../utils/redis.js";

export class BlockedController {

    static getBlocked = async (req: FastifyRequest<{
        Headers: UserHeaderIdType,
        Querystring: HydrateDBQueryType
    }>, rep: FastifyReply) => {
        const userId = req.headers['x-user-id'];
        const key = `users:data:${userId}:blocked` + (req.query.hydrate ? ':hydrate' : '');
        const data = await redisCache.getEx(key, {type:'EX', value: 3600 });
        if (data) {
            const blocked = JSON.parse(data);
            return rep.status(200).send({ message: 'Blocked users retrieved successfully', data: blocked });
        }
        const blocked = await BlockedService.findByID(userId, req.query.hydrate);
        redisCache.setEx(key, 3600, JSON.stringify(blocked)).catch(console.log);

        return rep.status(200).send({ message: 'Blocked users retrieved successfully', data: blocked});
    };

    static block = async (req: FastifyRequest<{
        Headers: UserHeaderIdType,
        Params: BlockedParamType
    }>, rep: FastifyReply) => {
        const userId = req.headers['x-user-id'];
        const { blockedId } = req.params;
        await BlockedService.blockUser(userId, blockedId);
        const multi = redisCache.multi();
        multi.del(`users:data:${userId}:blocked`);
        multi.del(`users:data:${blockedId}:blocked`);
        multi.del(`users:data:${userId}:blocked:hydrate`);
        multi.del(`users:data:${blockedId}:blocked:hydrate`);
        multi.del(`users:data:${userId}:friends`);
        multi.del(`users:data:${blockedId}:friends`);
        multi.exec().catch(console.log);
        return rep.status(201).send({ message: 'Blocked user added successfully' });
    }

    static unBlock = async (req: FastifyRequest<{
        Headers: UserHeaderIdType,
        Params: BlockedParamType
    }>, rep: FastifyReply) => {
        const userId = req.headers['x-user-id'];
        const { blockedId } = req.params;
        await BlockedService.unBlockUser(userId, blockedId);
        const multi = redisCache.multi();
        multi.del(`users:data:${userId}:blocked`);
        multi.del(`users:data:${blockedId}:blocked`);
        multi.del(`users:data:${userId}:blocked:hydrate`);
        multi.del(`users:data:${blockedId}:blocked:hydrate`);
        multi.del(`users:data:${userId}:friends`);
        multi.del(`users:data:${blockedId}:friends`);
        multi.exec().catch(console.log);
        return rep.status(200).send({ message: 'Blocked user removed successfully' });
    }
}

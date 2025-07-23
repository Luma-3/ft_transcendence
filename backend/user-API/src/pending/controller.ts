import { PendingService } from "./services.js";
import { FastifyReply, FastifyRequest } from "fastify";
import { AcceptParamType, PendingDBHydrateType, PendingParamType, TypePendingQueryType, UserHeaderIdType } from "./schema.js";
import { redisCache, redisPub } from "../utils/redis.js";

export class PendingsController {

    static getPending = async (req: FastifyRequest<{
        Headers: UserHeaderIdType,
        Querystring: TypePendingQueryType
    }>, rep: FastifyReply) => {
        const userId = req.headers['x-user-id'];
        const data = await redisCache.getEx(`users:data:${userId}:pendings:${req.query.action}`, {type:'EX', value: 3600 });
        if (data) {
            const pending = JSON.parse(data) as PendingDBHydrateType[];
            return rep.status(200).send({
                message: 'Pending requests retrieved successfully',
                data: await Promise.all(pending.map(async (p) => ({
                    ...p,
                    online: (await redisCache.sCard('sockets:' + p.id) as number > 0 )
                })))
            });
        }
        const pending = await PendingService.findByID(userId, req.query.action);
        redisCache.setEx(`users:data:${userId}:pendings:${req.query.action}`, 3600 , JSON.stringify(pending)).catch(console.log);
        
        return rep.status(200).send({
            message: 'Pending requests retrieved successfully',
            data: await Promise.all(pending.map(async (p) => ({
                    ...p,
                    online: (await redisCache.sCard('sockets:' + p.id) as number > 0 )
                })))
        });
    };

    static addPending = async (req: FastifyRequest<{
        Headers: UserHeaderIdType,
        Params: PendingParamType
    }>, rep: FastifyReply) => {
        const userId = req.headers['x-user-id'];
        const { pendingId } = req.params;
        await PendingService.addPending(userId, pendingId);
        const multi = redisCache.multi();

        multi.del(`users:data:${userId}:pendings:sender`);
        multi.del(`users:data:${pendingId}:pendings:receiver`);
        multi.exec().catch(console.log);
        redisPub.publish(`user:gateway:out:${pendingId}`, JSON.stringify({
            type: 'pending',
            action: 'add',
            data: userId
        })).catch(console.log);
        return rep.status(201).send({ message: 'Pending request added successfully' });
    }


    static removePending = async (req: FastifyRequest<{
        Headers: UserHeaderIdType,
        Params: PendingParamType
    }>, rep: FastifyReply) => {
        const userId = req.headers['x-user-id'];
        const { pendingId } = req.params;
        await PendingService.removePending(userId, pendingId);
        const multi = redisCache.multi();
        multi.del(`users:data:${userId}:pendings:sender`);
        multi.del(`users:data:${pendingId}:pendings:receiver`);
        multi.exec().catch(console.log);
        redisPub.publish(`user:gateway:out:${pendingId}`, JSON.stringify({
            type: 'pending',
            action: 'remove',
            data: userId
        })).catch(console.log);
        return rep.status(201).send({ message: 'Pending request removed successfully' });
    }

    static acceptPending = async (req: FastifyRequest<{
        Headers: UserHeaderIdType,
        Params: AcceptParamType
    }>, rep: FastifyReply) => {
        const userId = req.headers['x-user-id'];
        const { senderId } = req.params;
        
        await PendingService.acceptPending(senderId, userId);
        const multi = redisCache.multi();
        multi.del(`users:data:${userId}:friends`);
        multi.del(`users:data:${senderId}:friends`);
        multi.del(`users:data:${userId}:pendings:receiver`);
        multi.del(`users:data:${senderId}:pendings:sender`);
        multi.exec().catch(console.log);
        redisPub.publish(`user:gateway:out:${senderId}`, JSON.stringify({
            type: 'pending',
            action: 'accept',
            data: userId
        })).catch(console.log);
        return rep.status(200).send({ message: 'Pending request accepted successfully' });
    }

    static refusePending = async (req: FastifyRequest<{
        Headers: UserHeaderIdType,
        Params: AcceptParamType
    }>, rep: FastifyReply) => {
        const userId = req.headers['x-user-id'];
        const { senderId } = req.params;

        await PendingService.removePending(senderId, userId);
        const multi = redisCache.multi();
        multi.del(`users:data:${userId}:pendings:receiver`);
        multi.del(`users:data:${senderId}:pendings:sender`);
        multi.exec().catch(console.log);
        redisPub.publish(`user:gateway:out:${senderId}`, JSON.stringify({
            type: 'pending',
            action: 'refuse',
            data: userId
        })).catch(console.log);
        return rep.status(200).send({ message: 'Pending request refused successfully' });
    }

    
}

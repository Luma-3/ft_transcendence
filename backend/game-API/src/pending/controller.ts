import { PendingService } from "./services.js";
import { FastifyReply, FastifyRequest } from "fastify";
import { AcceptParamType, PendingDBHydrateType, PendingParamType, TypePendingQueryType, UserHeaderIdType } from "./schema.js";
import {  redisCache, redisPub } from "../utils/redis.js";
import { UserStatus } from "../utils/status.js";

export class PendingsController {

    static getPending = async (req: FastifyRequest<{
        Headers: UserHeaderIdType,
        Querystring: TypePendingQueryType
    }>, rep: FastifyReply) => {
        const userId = req.headers['x-user-id'];
        const data = await redisCache.getEx(`game:data:${userId}:pendings:${req.query.action}`, {type:'EX', value: 3600 }) as string|undefined;
        if (data) {
            const pending = JSON.parse(data) as PendingDBHydrateType[];
            return rep.status(200).send({
                message: 'Pending requests retrieved successfully',
                data: pending.map((p) => ({
                    ...p,
                    online: UserStatus.isUserOnline(p.id)
                }))
            });
        }
        const pending = await PendingService.findByID(userId, req.query.action);
        redisCache.setEx(`game:data:${userId}:pendings:${req.query.action}`, 3600 , JSON.stringify(pending)).catch(console.error);
        
        return rep.status(200).send({
            message: 'Pending requests retrieved successfully',
            data: pending.map(p => ({
                ...p,
                online: UserStatus.isUserOnline(p.id)
            }))
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

        multi.del(`game:data:${userId}:pendings:sender`);
        multi.del(`game:data:${pendingId}:pendings:receiver`);
        multi.exec().catch(console.error);
        redisPub.publish(`game:gateway:out:${pendingId}`, JSON.stringify({
            type: 'pending',
            action: 'add',
            data: userId
        })).catch(console.error);
        return rep.status(201).send({ message: 'Pending request added successfully' });
    }


    static removePending = async (req: FastifyRequest<{
        Headers: UserHeaderIdType,
        Params: PendingParamType
    }>, rep: FastifyReply) => {
        const userId = req.headers['x-user-id'];
        const { pendingId } = req.params;
        await PendingService.removePending(userId, pendingId, true);
        const multi = redisCache.multi();
        multi.del(`game:data:${userId}:pendings:sender`);
        multi.del(`game:data:${pendingId}:pendings:receiver`);
        multi.exec().catch(console.error);
        redisPub.publish(`game:gateway:out:${pendingId}`, JSON.stringify({
            type: 'pending',
            action: 'remove',
            data: userId
        })).catch(console.error);
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
        multi.del(`game:data:${userId}:pendings:receiver`);
        multi.del(`game:data:${senderId}:pendings:sender`);
        multi.exec().catch(console.error);
        redisPub.publish(`game:gateway:out:${senderId}`, JSON.stringify({
            type: 'pending',
            action: 'accept',
            data: userId
        })).catch(console.error);
        return rep.status(200).send({ message: 'Pending request accepted successfully' });
    }

    static refusePending = async (req: FastifyRequest<{
        Headers: UserHeaderIdType,
        Params: AcceptParamType
    }>, rep: FastifyReply) => {
        const userId = req.headers['x-user-id'];
        const { senderId } = req.params;

        await PendingService.removePending(senderId, userId, true);
        const multi = redisCache.multi();
        multi.del(`game:data:${userId}:pendings:receiver`);
        multi.del(`game:data:${senderId}:pendings:sender`);
        multi.exec().catch(console.error);
        redisPub.publish(`game:gateway:out:${senderId}`, JSON.stringify({
            type: 'pending',
            action: 'refuse',
            data: userId
        })).catch(console.error);
        return rep.status(200).send({ message: 'Pending request refused successfully' });
    }

    
}

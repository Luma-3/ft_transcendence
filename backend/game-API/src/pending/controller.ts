import { PendingService } from "./services.js";
import { FastifyReply, FastifyRequest } from "fastify";
import { AcceptParamType, PendingParamType, TypePendingQueryType, UserHeaderIdType } from "./schema.js";
import { redisPub } from "../utils/redis.js";
import { UserStatus } from "../utils/status.js";
import { RoomBodyType } from "../room/room.schema.js";

export class PendingsController {

    static getPending = async (req: FastifyRequest<{
        Headers: UserHeaderIdType,
        Querystring: TypePendingQueryType
    }>, rep: FastifyReply) => {
        const userId = req.headers['x-user-id'];
        const pending = await PendingService.findByID(userId, req.query.action);
        
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
        Params: PendingParamType,
        Body: RoomBodyType
    }>, rep: FastifyReply) => {
        const userId = req.headers['x-user-id'];
        const { pendingId } = req.params;
        await PendingService.addPending(userId, pendingId, req.body);
        redisPub.publish(`game:gateway:out:${pendingId}`, JSON.stringify({
            action: 'pendingAdd',
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
        redisPub.publish(`game:gateway:out:${pendingId}`, JSON.stringify({
            action: 'pendingRemove',
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
        return rep.status(200).send({ message: 'Pending request accepted successfully' });
    }

    static refusePending = async (req: FastifyRequest<{
        Headers: UserHeaderIdType,
        Params: AcceptParamType
    }>, rep: FastifyReply) => {
        const userId = req.headers['x-user-id'];
        const { senderId } = req.params;

        await PendingService.removePending(senderId, userId, true);
        redisPub.publish(`game:gateway:out:${senderId}`, JSON.stringify({
            action: 'pendingRefuse',
            data: userId
        })).catch(console.error);
        return rep.status(200).send({ message: 'Pending request refused successfully' });
    }

    
}

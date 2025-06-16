import { PendingService } from "./pending.services.js";
import { InternalServerError } from "@transcenduck/error";
import { FastifyReply, FastifyRequest } from "fastify";
import { AcceptParamType, PendingParamType, TypePendingQueryType, UserHeaderIdType } from "./pending.schema.js";
import { FriendsService } from "../friends/friends.services.js";
import { knexInstance } from "../utils/knex.js";



export class PendingsController {

    static getPending = async (req: FastifyRequest<{
        Headers: UserHeaderIdType,
        Querystring: TypePendingQueryType
    }>, rep: FastifyReply) => {
        const userId = req.headers['x-user-id'];
        const pending = await PendingService.findByID(userId, req.query.action);

        return rep.status(200).send({
            message: 'Pending requests retrieved successfully',
            data: pending});
    };

    static addPending = async (req: FastifyRequest<{
        Headers: UserHeaderIdType,
        Params: PendingParamType
    }>, rep: FastifyReply) => {
        const userId = req.headers['x-user-id'];
        const { pendingId } = req.params;

        try {
            await knexInstance.transaction(async (trx) => {
                if(await FriendsService.checkFriendshipExists(trx, userId, pendingId))
                    throw new InternalServerError(`You are already friends with user ${pendingId}`);
                await PendingService.addPending(trx, userId, pendingId);
            } );
        } catch (error) {
            if (error instanceof Error)
                throw new InternalServerError(`Failed to add pending request: ${error.message}`);
        }
        return rep.status(201).send({ message: 'Pending request added successfully' });
    }

    static acceptPending = async (req: FastifyRequest<{
        Headers: UserHeaderIdType,
        Params: AcceptParamType
    }>, rep: FastifyReply) => {
        const userId = req.headers['x-user-id'];
        const { senderId } = req.params;
        
        try {
            await PendingService.acceptPending(senderId, userId);
        } catch (error) {
            if (error instanceof Error)
                throw new InternalServerError(`Failed to accept pending request: ${error.message}`);
        }
        return rep.status(200).send({ message: 'Pending request accepted successfully' });
    }

    static refusePending = async (req: FastifyRequest<{
        Headers: UserHeaderIdType,
        Params: AcceptParamType
    }>, rep: FastifyReply) => {
        const userId = req.headers['x-user-id'];
        const { senderId } = req.params;

        await PendingService.refusePending(senderId, userId);
        return rep.status(200).send({ message: 'Pending request refused successfully' });
    }
}

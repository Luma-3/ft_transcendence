import { BlockedService } from "./blocked.services.js";
import { FastifyReply, FastifyRequest } from "fastify";
import { BlockedParamType, HydrateDBQueryType, UserHeaderIdType } from "./blocked.schema.js";



export class BlockedController {

    static getBlocked = async (req: FastifyRequest<{
        Headers: UserHeaderIdType,
        Querystring: HydrateDBQueryType
    }>, rep: FastifyReply) => {
        const userId = req.headers['x-user-id'];
        const blocked = await BlockedService.findByID(userId, req.query.hydrate);

        return rep.status(200).send({
            message: 'Blocked users retrieved successfully',
            data: blocked});
    };

    static block = async (req: FastifyRequest<{
        Headers: UserHeaderIdType,
        Params: BlockedParamType
    }>, rep: FastifyReply) => {
        const userId = req.headers['x-user-id'];
        const { blockedId } = req.params;
        await BlockedService.blockUser(userId, blockedId);
        return rep.status(201).send({ message: 'Blocked user added successfully' });
    }

    static unBlock = async (req: FastifyRequest<{
        Headers: UserHeaderIdType,
        Params: BlockedParamType
    }>, rep: FastifyReply) => {
        const userId = req.headers['x-user-id'];
        const { blockedId } = req.params;

        await BlockedService.unBlockUser(userId, blockedId);
        return rep.status(200).send({ message: 'Blocked user removed successfully' });
    }
}

import { FriendsService } from "./friends.services.js";
import { FriendParamType, UserHeaderIdType } from "./friends.schema";
import { FastifyReply, FastifyRequest } from "fastify";



export class FriendsController {

    static getFriends = async (req: FastifyRequest<{
        Headers: UserHeaderIdType
    }>, rep: FastifyReply) => {
        const userId = req.headers['x-user-id'];
        const friends = await FriendsService.findFriendsByID(userId);

        return rep.status(200).send({
            message: 'Friends retrieved successfully',
            data: friends});
    };

    static removeFriend = async (req: FastifyRequest<{
        Headers: UserHeaderIdType,
        Params: FriendParamType
    }>, rep: FastifyReply) => {
        const userId = req.headers['x-user-id'];
        const { friendId } = req.params;

        await FriendsService.removeBidirectionalFriend(userId, friendId);
        return rep.status(200).send({ message: 'Friendship removed successfully' });
    }
}

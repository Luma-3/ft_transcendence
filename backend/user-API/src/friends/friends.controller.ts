import { FriendsService } from "./friends.services.js";
import { FriendParamType, UserHeaderIdType } from "./friends.schema";
import { FastifyReply, FastifyRequest } from "fastify";
import { redisCache } from "../utils/redis.js";



export class FriendsController {

    static getFriends = async (req: FastifyRequest<{
        Headers: UserHeaderIdType
    }>, rep: FastifyReply) => {
        const userId = req.headers['x-user-id'];
        const data = await redisCache.getEx(`users:data:${userId}:friends`, {type:'EX', value: 3600 });
        if (data) {
            const friends = JSON.parse(data);
            return rep.status(200).send({
                message: 'Friends retrieved successfully',
                data: friends
            });
        }
        const friends = await FriendsService.findFriendsByID(userId);
        redisCache.setEx(`users:data:${userId}:friends`, 3600 , JSON.stringify(friends)).catch(console.error);
        return rep.status(200).send({
            message: 'Friends retrieved successfully',
            data: friends
        });
    };

    static removeFriend = async (req: FastifyRequest<{
        Headers: UserHeaderIdType,
        Params: FriendParamType
    }>, rep: FastifyReply) => {
        const userId = req.headers['x-user-id'];
        const { friendId } = req.params;

        await FriendsService.removeBidirectionalFriend(userId, friendId);
        const multi = redisCache.multi();
        multi.DEL(`users:data:${userId}:friends`);
        multi.DEL(`users:data:${friendId}:friends`);
        multi.exec().catch(console.error);
        return rep.status(200).send({ message: 'Friendship removed successfully' });
    }
}

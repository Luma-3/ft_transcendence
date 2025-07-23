import { FriendsService } from "./services.js";
import { FriendDBHydrateType, FriendParamType, UserHeaderIdType } from "./schema.js";
import { FastifyReply, FastifyRequest } from "fastify";
import { redisCache, redisPub } from "../utils/redis.js";



export class FriendsController {

    static getFriends = async (req: FastifyRequest<{
        Headers: UserHeaderIdType
    }>, rep: FastifyReply) => {
        const userId = req.headers['x-user-id'];
        const data = await redisCache.getEx(`users:data:${userId}:friends`, {type:'EX', value: 3600 });
        if (data) {
            const friends = JSON.parse(data) as FriendDBHydrateType[];
            return rep.status(200).send({
                message: 'Friends retrieved successfully',
                data: await Promise.all(friends.map(async (p) => ({
                    ...p,
                    online: (await redisCache.sCard('sockets:' + p.id) as number > 0 )
                })))
                
            });
        }
        const friends = await FriendsService.findFriendsByID(userId);
        redisCache.setEx(`users:data:${userId}:friends`, 3600 , JSON.stringify(friends)).catch(console.log);
        return rep.status(200).send({
            message: 'Friends retrieved successfully',
            data: await Promise.all(friends.map(async (p) => ({
                    ...p,
                    online: (await redisCache.sCard('sockets:' + p.id) as number > 0 )
                })))
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
        multi.del(`users:data:${userId}:friends`);
        multi.del(`users:data:${friendId}:friends`);
        multi.exec().catch(console.log);
        redisPub.publish(`user:gateway:out:${friendId}`, JSON.stringify({
            type: 'friend',
            action: 'remove',
            data: userId
        })).catch(console.log);
        return rep.status(200).send({ message: 'Friendship removed successfully' });
    }
}

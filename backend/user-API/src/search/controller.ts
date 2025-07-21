import { SearchService } from "./services.js";
import { SearchQueryType, UserHeaderIdType } from "./schema.js";
import { FastifyReply, FastifyRequest } from "fastify";
import { UserStatus } from "../preferences/status.js";



export class SearchController {

    static search = async (req: FastifyRequest<{
        Headers: UserHeaderIdType,
        Querystring: SearchQueryType
    }>, rep: FastifyReply) => {
        const userId = req.headers['x-user-id'];
        const { q, page = 1, limit = 10, hydrate } = req.query;
        const users = await SearchService.search(userId, q, page, limit, hydrate);

        return rep.status(200).send({
            message: 'Search results for the given query',
            data: {
                page,
                limit,
                total: users.length,
                users: users.map(user => ({...user, online: UserStatus.isUserOnline(user.id)}))
            }
        });
    };
}

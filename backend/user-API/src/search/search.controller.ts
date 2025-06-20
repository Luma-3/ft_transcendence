import { SearchService } from "./search.services.js";
import { SearchQueryType, UserHeaderIdType } from "./search.schema.js";
import { FastifyReply, FastifyRequest } from "fastify";



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
                users
            }});
    };
}

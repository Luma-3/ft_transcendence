import { searchModel } from "./search.model.js";

export class SearchService {
    /**
     * Retrieves the list of friends for a given user ID.
     * @param id - The user ID to find friends for.
     * @returns A promise that resolves to an array of friends.
     * @throws NotFoundError if no friends are found for the user ID.
     */
    static async search(userId: string, username: string, page: number = 1, limit: number = 10, hydrate: boolean = true) {
        return await searchModel.search(userId, username, page, limit, hydrate);
    }
}


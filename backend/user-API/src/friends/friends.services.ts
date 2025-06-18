import { friendsModel } from "./friends.model.js";
import { type Knex } from "knex";
import { NotFoundError } from "@transcenduck/error";
import { knexInstance } from "../utils/knex.js";

export class FriendsService {
    /**
     * Retrieves the list of friends for a given user ID.
     * @param id - The user ID to find friends for.
     * @returns A promise that resolves to an array of friends.
     * @throws NotFoundError if no friends are found for the user ID.
     */
    static async findFriendsByID(id: string) {
        const data = await friendsModel.findByID(id);
        if (!data)
            throw new NotFoundError(`User with ID ${id}`);
        return data;
    }

    /**
     * Adds a friend for a given user ID.
     * @param trx - The transaction object for database operations.
     * @param id - The user ID to add a friend for.
     * @param friend_id - The ID of the friend to be added.
     * @returns A promise that resolves to the created friend record.
     */
    static async addFriend(trx: Knex.Transaction, id: string, friend_id: string) {
        return await friendsModel.create(trx, id, friend_id);
    }

    /**
     * Adds a friend bidirectionally for two user IDs.
     * @param id - The first user ID.
     * @param friend_id - The second user ID (friend).
     * @returns A promise that resolves when both friendships are created.
     */
    static  addBidirectionalFriend(id: string, friend_id: string) {
       return knexInstance.transaction(async (trx) => {
            await friendsModel.create(trx, id, friend_id);
            await friendsModel.create(trx, friend_id, id);
        });
    }

    /**
     * Removes a friend for a given user ID.
     * @param trx - The transaction object for database operations.
     * @param id - The user ID to remove a friend from.
     * @param friendId - The ID of the friend to be removed.
     * @returns A promise that resolves when the friend is removed.
     */
    static async removeFriend(trx: Knex.Transaction, id: string, friendId: string) {
        return await friendsModel.delete(trx, id, friendId);
    }

    /**
     * Removes a friend bidirectionally for two user IDs.
     * @param id - The first user ID.
     * @param friendId - The second user ID (friend).
     * @returns A promise that resolves when both friendships are removed.
     */
    static removeBidirectionalFriend(id: string, friendId: string) {
        return knexInstance.transaction(async (trx) => {
            await friendsModel.delete(trx, id, friendId);
            await friendsModel.delete(trx, friendId, id);
        });
    }

    static checkFriendshipExists(trx: Knex.Transaction, id: string, friendId: string): Promise<boolean> {
        return trx('friends')
            .select('id')
            .where('user_id', id)
            .andWhere('friend_id', friendId)
            .count('id as count')
            .first()
            .then((count) => {
                return count !== undefined && (count.count as number) > 0;
            });
    }
}


import { blockedModel } from "./blocked.model.js";
import { ConflictError, NotFoundError } from "@transcenduck/error";
import { Knex, knexInstance } from "../utils/knex.js";
import { FriendsService } from "../friends/friends.services.js";

export class BlockedService {

    /**
    * Retrieves the list of blocked users for a given user ID.
    * @param id - The user ID to find blocked users for.
    * @param action - The action type, either "sender" or "receiver".
    * @returns A promise that resolves to an array of blocked users or undefined if no users are found.
    */
    static async findByID(id: string, hydrate: boolean = true) {
        const data = await blockedModel.findByID(id, hydrate);
        if (!data)
            throw new NotFoundError(`User with ID ${id}`);
        return data;
    }

    /**
    * Adds a new blocked user between two users.
    * @param id - The user ID who is blocking the other user.
    * @param blockedId - The user ID who is being blocked.
    * @returns A promise that resolves to the created blocked user record.
    */
    static async blockUser(
        id: string, blockedId: string) {

        return await knexInstance.transaction(async (trx) => {
            if(await BlockedService.checkBlockedExists(trx, id, blockedId)) {
                throw new ConflictError(`You have already blocked user ${blockedId}`);
            } else if(id === blockedId) {
                throw new ConflictError(`You cannot block yourself`);
            }
            if(await FriendsService.checkFriendshipExists(trx, id, blockedId)){
                await FriendsService.removeFriend(trx, id, blockedId);
                await FriendsService.removeFriend(trx, blockedId, id);
            }
            await blockedModel.create(trx, id, blockedId);
        } );
    }

    /**
    * Unblocks a user by removing the blocked relationship.
    * @param id - The user ID who is unblocking the other user.
    * @param blockedId - The user ID who is being unblocked.
    * @returns A promise that resolves when the blocked user is removed.
    */
    static async unBlockUser(id: string, blockedId: string) {
        return await knexInstance.transaction(async (trx) => {
            await blockedModel.delete(trx, id, blockedId);
        });
    }


    static checkBlockedExists(trx: Knex.Transaction, id: string, friendId: string): Promise<boolean> {
        return blockedModel.exists(trx, id, friendId);
    }
}


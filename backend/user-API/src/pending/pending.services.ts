import { pendingModel } from "./pending.model.js";
import { ConflictError, NotFoundError } from "@transcenduck/error";
import { Knex, knexInstance } from "../utils/knex.js";
import { friendsModel } from "../friends/friends.model.js";
import { FriendsService } from "../friends/friends.services.js";
import { BlockedService } from "../blocked/blocked.services.js";

export class PendingService {

    /**
     * Retrieves the list of pending requests for a given user ID.
     * @param id - The user ID to find pending requests for.
     * @param action - The action type, either "sender" or "receiver".
     * @returns A promise that resolves to an array of pending requests or undefined if no requests are found.
     */
    static async findByID(id: string, action: ("sender" | "receiver") = "sender") {
        const data = await pendingModel.findByID(id, action);
        if (!data)
            throw new NotFoundError(`User with ID ${id}`);
        return data;
    }

    /**
     * Adds a new pending request between two users.
     * @param id - The user ID who is sending the request.
     * @param pendingId - The user ID who is receiving the request.
     * @returns A promise that resolves to the created pending request.
     */
    static async addPending(id: string, pendingId: string) {
        return  await knexInstance.transaction(async (trx) => {
            if(await FriendsService.checkFriendshipExists(trx, id, pendingId))
                throw new ConflictError(`You are already friends with user ${pendingId}`);
            else if(await PendingService.exists(trx, pendingId, id))
                throw new ConflictError(`You already have a pending request with user ${pendingId}`);
            else if(await PendingService.exists(trx, id, pendingId))
                throw new ConflictError(`User ${pendingId} has already sent you a pending request`);
            else if(await BlockedService.checkBlockedExists(trx, id, pendingId))
                throw new ConflictError(`You cannot send a pending request to user ${pendingId} because they are blocked`);
            else if(await BlockedService.checkBlockedExists(trx, pendingId, id))
                throw new ConflictError(`You cannot send a pending request to user ${pendingId} because they have blocked you`);
            else if(id === pendingId)
                throw new ConflictError(`You cannot send a pending request to yourself`);

            await pendingModel.create(trx, id, pendingId);
        } );
    }

    /**
     * Accepts a pending request and creates a friendship between two users.
     * @param id - The user ID who is accepting the request.
     * @param pendingId - The user ID of the pending request sender.
     * @returns A promise that resolves when the friendship is created.
     */
    static  async acceptPending(id: string, pendingId: string) {
        // First, create the friendship in the friends table
        return await knexInstance.transaction(async (trx) => {
            if(!(await pendingModel.exists(trx, id, pendingId))) {
                throw new NotFoundError(`Pending request from user ${pendingId} not found for user ${id}`);
            }else if(await BlockedService.checkBlockedExists(trx, id, pendingId)) {
                await pendingModel.delete(trx, id, pendingId);
                throw new ConflictError(`You cannot accept a pending request from user ${pendingId} because they are blocked`);
            }else if(await BlockedService.checkBlockedExists(trx, pendingId, id)) {
                await pendingModel.delete(trx, id, pendingId);
                throw new ConflictError(`You cannot accept a pending request from user ${pendingId} because you have blocked them`);
            } else if(id === pendingId) {
                await pendingModel.delete(trx, id, pendingId);
                throw new ConflictError(`You cannot accept a pending request from yourself`);
            }
            await pendingModel.delete(trx, id, pendingId);
            await friendsModel.create(trx, id, pendingId);
            await friendsModel.create(trx, pendingId, id);
        });
    }

    /**
     * Refuses a pending request between two users.
     * @param id - The user ID who is refusing the request.
     * @param friendId - The user ID of the pending request sender.
     * @returns A promise that resolves when the pending request is deleted.
     */
    static async removePending(id: string, friendId: string) {
        return await knexInstance.transaction(async (trx) => {
            if(!(await pendingModel.exists(trx, id, friendId))) {
                throw new NotFoundError(`Pending request from user ${friendId} not found for user ${id}`);
            }
            await pendingModel.delete(trx, id, friendId);
        });
    }

    static async exists(trx: Knex.Transaction, id: string, pendingId: string): Promise<boolean> {
        const count = await trx('pending')
            .select('id')
            .where('user_id', id)
            .andWhere('pending_id', pendingId)
            .count('* as count').first();
        return count !== undefined && (count.count as number) > 0;
    }
}


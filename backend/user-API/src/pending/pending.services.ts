import { pendingModel } from "./pending.model.js";
import { NotFoundError } from "@transcenduck/error";
import { Knex, knexInstance } from "../utils/knex.js";
import { friendsModel } from "../friends/friends.model.js";

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
    static async addPending(trx: Knex.Transaction,
        id: string, pendingId: string) {
        return await pendingModel.create(trx, id, pendingId);
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
            }
            await pendingModel.delete(trx, id, pendingId);
            await friendsModel.create(trx, id, pendingId);
            // await friendsModel.create(trx, pendingId, id);
            return { message: 'Friendship created successfully' };
        });
    }

    /**
     * Refuses a pending request between two users.
     * @param id - The user ID who is refusing the request.
     * @param friendId - The user ID of the pending request sender.
     * @returns A promise that resolves when the pending request is deleted.
     */
    static async refusePending(id: string, friendId: string) {
        return await knexInstance.transaction(async (trx) => {
            if(!(await pendingModel.exists(trx, id, friendId))) {
                throw new NotFoundError(`Pending request from user ${friendId} not found for user ${id}`);
            }
            await pendingModel.delete(trx, id, friendId);
        });
    }
}


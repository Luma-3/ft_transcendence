import { pendingModel } from "./model.js";
import { ConflictError, NotFoundError } from "@transcenduck/error";
import { Knex, knexInstance } from "../utils/knex.js";
import { RoomManager } from "../core/runtime/RoomManager.js";
import { RoomService } from "../room/room.service.js";
import { UserStatus } from "../utils/status.js";
import server from "../fastify.js";
import { RoomBodyType } from "../room/room.schema.js";

export class PendingService {

    public constructor() {
        RoomManager.getInstance().on('room:end',  (roomId: string) => {
            knexInstance.transaction(async (trx) => {
                if (!await pendingModel.existsByRoomId(trx, roomId)) {
                    return;
                }
                await pendingModel.deleteByRoomId(trx, roomId);
                server.log.info(`Removed pending requests for room ${roomId}`);
            }).catch(console.error);
        });
        RoomManager.getInstance().on('room:playerleft', (roomId: string) => {
            knexInstance.transaction(async (trx) => {
                if (!await pendingModel.existsByRoomId(trx, roomId)) {
                    return;
                }
                await pendingModel.deleteByRoomId(trx, roomId);
                server.log.info(`Removed pending requests for room ${roomId}`);
            }).catch(console.error);
        });
    }

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
    static async addPending(id: string, pendingId: string, data: RoomBodyType) {
        return await knexInstance.transaction(async (trx) => {
            if (await PendingService.exists(trx, pendingId, id))
                throw new ConflictError(`You already have a pending request with user ${pendingId}`);
            else if(await PendingService.exists(trx, id, pendingId))
                throw new ConflictError(`User ${pendingId} has already sent you a pending request`);
            /* else if(await BlockedService.checkBlockedExists(trx, id, pendingId))
                throw new ConflictError(`You cannot send a pending request to user ${pendingId} because they are blocked`);
            else if(await BlockedService.checkBlockedExists(trx, pendingId, id))
                throw new ConflictError(`You cannot send a pending request to user ${pendingId} because they have blocked you`); */
            else if(id === pendingId)
                throw new ConflictError(`You cannot send a pending request to yourself`);
            /* else if(!UserStatus.isUserOnline(pendingId))
                throw new ConflictError(`You cannot send a pending request to user ${pendingId} because they are offline`); */
            const player = await RoomService.createPlayer(id, data.playerName);
            const roomId = await RoomService.createPrivateRoom(player);
            await pendingModel.create(trx, id, pendingId, roomId);
        });
    }
h
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
            }/* else if(await BlockedService.checkBlockedExists(trx, id, pendingId)) {
                await pendingModel.delete(trx, id, pendingId);
                throw new ConflictError(`You cannot accept a pending request from user ${pendingId} because they are blocked`);
            }else if(await BlockedService.checkBlockedExists(trx, pendingId, id)) {
                await pendingModel.delete(trx, id, pendingId);
                throw new ConflictError(`You cannot accept a pending request from user ${pendingId} because you have blocked them`);
            } */ else if(id === pendingId) {
                await pendingModel.delete(trx, id, pendingId);
                throw new ConflictError(`You cannot accept a pending request from yourself`);
            } else if(!await UserStatus.isUserOnline(id)) {
                throw new ConflictError(`user sender is offline`);
            }
            const {room_id} = await pendingModel.findRoomByUserIdAndPendingId(trx, id, pendingId);
            const player = await RoomService.createPlayer(pendingId);
            RoomManager.getInstance().joinRoom(player, room_id);
            await pendingModel.delete(trx, id, pendingId);
        });
    }

    /**
     * Refuses a pending request between two users.
     * @param id - The user ID who is refusing the request.
     * @param friendId - The user ID of the pending request sender.
     * @returns A promise that resolves when the pending request is deleted.
     */
    static async removePending(id: string, friendId: string, withRoom = false) {
        return await knexInstance.transaction(async (trx) => {
            if(!(await pendingModel.exists(trx, id, friendId))) {
                throw new NotFoundError(`Pending request from user ${friendId} not found for user ${id}`);
            }
            if(withRoom) {
                const {room_id} = await pendingModel.findRoomByUserIdAndPendingId(trx, id, friendId);
                await pendingModel.delete(trx, id, friendId);
                try {
                    RoomManager.getInstance().stopRoom(room_id, false);
                } catch (error) {
                    server.log.error(error);
                }
            }
            else {
                await pendingModel.delete(trx, id, friendId);
            }
        });
    }

    async removePendingFromRoom(roomId: string) {
        await knexInstance.transaction(async (trx) => {
            await pendingModel.deleteByRoomId(trx, roomId);
            try {
                RoomManager.getInstance().stopRoom(roomId, false);
            } catch (error) {
                server.log.error(error);
            }
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


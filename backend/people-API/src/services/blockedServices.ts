import { UnauthorizedError } from "@transcenduck/error";
import { peopleModel } from "../models/peopleModel.js";
import knex from "../utils/knex.js";

export class BlockedServices {

  async blockUser(userId: string, targetUserId: string) {
    if(await peopleModel.isBlocked(userId, targetUserId))
      throw new UnauthorizedError("the user is already blocked");
    knex.transaction(async (trx) => {
      try {
        await peopleModel.removeFriend(trx, userId, targetUserId);
        if(targetUserId != userId) {
            await peopleModel.removeFriend(trx, targetUserId, userId);
        }
      }catch (error) {
      }
    });
    await peopleModel.blockUser(userId, targetUserId);

    if(targetUserId != userId) {
      await peopleModel.blockUser(targetUserId, userId, "receiver");
    }
  }

  async unblockUser(userId: string, targetUserId: string) {
    if(!await peopleModel.unBlockUser(userId, targetUserId)){
      throw new UnauthorizedError("the user is not blocked or you are blocked by the user");
    }
  }

}

export const blockedServices = new BlockedServices();
import { peopleModel } from "../models/peopleModel";
import knex from "../utils/knex";

export class BlockedServices {

  async blockUser(userId: string, targetUserId: string) {
    if(await peopleModel.isBlocked(userId, targetUserId))
      return ;
    knex.transaction(async (trx) => {
      try {
        await peopleModel.removeFriend(trx, userId, targetUserId);
        if(targetUserId != userId) {
            await peopleModel.removeFriend(trx, targetUserId, userId);
        }
      }catch (error) {
        console.error("Error removing friend during block:", error);
      }
    });
    try {
      await peopleModel.blockUser(userId, targetUserId);

      if(targetUserId != userId) {
        await peopleModel.blockUser(targetUserId, userId, "receiver");
      }
    } catch (error) {
      console.error("Error blocking user:", error);
      throw new Error("Failed to block user");
    }
  }

  async unblockUser(userId: string, targetUserId: string) {
	  return peopleModel.unBlockUser(userId, targetUserId);
  }

}
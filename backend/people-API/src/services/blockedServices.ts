import { PeopleModel } from "../models/peopleModel";
import knex from "../utils/knex";

export class BlockedServices {
  peopleModel: PeopleModel;
  constructor(peopleModel: PeopleModel) {
    this.peopleModel = peopleModel;
  }

  async blockUser(userId: string, targetUserId: string) {
    if(await this.peopleModel.isBlocked(userId, targetUserId))
      return ;
    knex.transaction(async (trx) => {
      try {
        await this.peopleModel.removeFriend(trx, userId, targetUserId);
        if(targetUserId != userId) {
            await this.peopleModel.removeFriend(trx, targetUserId, userId);
        }
      }catch (error) {
        console.error("Error removing friend during block:", error);
      }
    });
    try {
      await this.peopleModel.blockUser(userId, targetUserId);

      if(targetUserId != userId) {
        await this.peopleModel.blockUser(targetUserId, userId, "receiver");
      }
    } catch (error) {
      console.error("Error blocking user:", error);
      throw new Error("Failed to block user");
    }
  }

  async unblockUser(userId: string, targetUserId: string) {
	  return this.peopleModel.unBlockUser(userId, targetUserId);
  }
}
import { PeopleModel } from "../models/peopleModel.js";

export class BlockedServices {
  peopleModel;
  knex;
  constructor(knex, peopleModel) {
    this.peopleModel = peopleModel;
    this.knex = knex;
  }

  async blockUser(userId, targetUserId) {
    if(await this.peopleModel.isBlocked(userId, targetUserId))
      return ;
    this.knex.transaction(async (trx) => {
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

  async unblockUser(userId, targetUserId) {
	  return this.peopleModel.unBlockUser(userId, targetUserId);
  }
}
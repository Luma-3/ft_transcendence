import { PeopleModel } from "../models/peopleModel.js";

export class BlockedServices {
  peopleModel;

  constructor(peopleModel) {
	this.peopleModel = peopleModel;
  }

  async blockUser(userId, targetUserId) {
	return this.peopleModel.blockUser(userId, targetUserId);
  }

  async unblockUser(userId, targetUserId) {
	return this.peopleModel.unBlockUser(userId, targetUserId);
  }
}
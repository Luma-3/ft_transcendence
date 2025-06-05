import { UnauthorizedError, ForbiddenError } from "@transcenduck/error"
import { PeopleModel } from "../models/peopleModel";

export class FriendsServices {
  peopleModel: PeopleModel;
  constructor(peopleModel: PeopleModel) {
    this.peopleModel = peopleModel;
  }

  async addFriend(userId: string, friendId: string) {
    if(await this.peopleModel.isBlocked(userId, friendId)) {
      throw new ForbiddenError("Cannt add friend a personne blocked");
    }
    if(!await this.peopleModel.hasPending(userId, friendId)) {
      await this.peopleModel.sendPending(userId, friendId);
      return;
    }
    if(await this.peopleModel.typePending(userId, friendId) === "receiver") {
        await this.peopleModel.acceptPending(userId, friendId);
        return;
    }
    throw new UnauthorizedError("You cannot add a friend that has already sent you a request");
  }

  async removeFriend(userId: string, friendId: string) {
    return this.peopleModel.removeFriends(userId, friendId);
  }

  async refuseFriend(userId: string, friendId: string) {
    return await this.peopleModel.refuseFriend(userId, friendId);
  }
}
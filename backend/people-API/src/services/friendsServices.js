import { UnauthorizedError, ForbiddenError } from "@transcenduck/error"

export class FriendsServices {
  peopleModel;

  constructor(peopleModel) {
    this.peopleModel = peopleModel;
  }

  async addFriend(userId, friendId) {
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

  async removeFriend(userId, friendId) {
    return this.peopleModel.removeFriends(userId, friendId);
  }

  async refuseFriend(userId, friendId) {
    return await this.peopleModel.refuseFriend(userId, friendId);
  }
}
import { UnauthorizedError, ForbiddenError } from "@transcenduck/error"
import { peopleModel } from "../models/peopleModel";

export class FriendsServices {

  async addFriend(userId: string, friendId: string) {
    if(await peopleModel.isBlocked(userId, friendId)) {
      throw new ForbiddenError("you are blocked by the user");
    }
    if(!await peopleModel.hasPending(userId, friendId)) {
      await peopleModel.sendPending(userId, friendId);
      return;
    }
    if(await peopleModel.typePending(userId, friendId) === "receiver") {
        await peopleModel.acceptPending(userId, friendId);
        return;
    }
    throw new UnauthorizedError("You cannot add a friend that has already sent you a request");
  }

  async removeFriend(userId: string, friendId: string) {
    return peopleModel.removeFriends(userId, friendId);
  }

  async refuseFriend(userId: string, friendId: string) {
    return await peopleModel.refuseFriend(userId, friendId);
  }
}

export const friendsServices = new FriendsServices();
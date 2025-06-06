import { ForbiddenError, UnauthorizedError } from "@transcenduck/error"
import { peopleModel } from "../models/peopleModel";
import { ResponsePublicType } from "../schema/people.schema";

export class PeopleServices {

  async getAll(userID: string) {
    if (!userID) {
      throw new UnauthorizedError('User ID is required');
    }
    const AllpersonDB = await peopleModel.findAll();
    if (!AllpersonDB) {
      throw new UnauthorizedError('Person not found');
    }
    const result = await peopleModel.findByUserID(userID, true, ['friends', 'blocked', 'pending']);
    if(!result)
      return [];
    const {friends = {}, blocked= {}, pending = {}} = result;
    const Allperson: ResponsePublicType[] = [];
    for(const person of AllpersonDB) {
      if (person.user_id != userID && friends[person.user_id] === undefined && pending[person.user_id] === undefined) {
        Allperson.push({
          user_id: person.user_id,
          username: person.username,
          blocked: blocked[person.user_id] !== undefined
        });
      }
    }
    return Allperson;
  }

  async getSelf(userID: string) {
    if (!userID) {
      throw new UnauthorizedError('User ID is required');
    }

    const person = await peopleModel.findByUserID(userID);
    if (!person) {
      throw new ForbiddenError('Person not found');
    }
    return person;
  }

  async search(userId: string , value: string) {
    return peopleModel.findByUsername(userId, value);
  }
}
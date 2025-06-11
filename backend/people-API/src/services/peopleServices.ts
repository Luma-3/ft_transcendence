import { ForbiddenError, InternalServerError, UnauthorizedError } from "@transcenduck/error"
import { peopleModel } from "../models/peopleModel.js";
import { ResponsePublicType } from "../schema/people.schema.js";

export class PeopleServices {

  async getAll(userID: string) {
    const AllpersonDB = await peopleModel.findAll();
    if (!AllpersonDB) {
      throw new InternalServerError("error acces database");
    }
    const result = await peopleModel.findByUserID(userID, true, ['friends', 'blocked', 'pending']);
    if(!result)
      throw new InternalServerError("user not existe on database");
    const {friends, blocked= {}, pending = {}} = result;
    const Allperson: ResponsePublicType[] = [];
    for(const person of AllpersonDB) {
      if (person.user_id != userID && (<{[x: string]: string}>friends)[person.user_id] === undefined && (<{[x: string]: string}>pending)[person.user_id] === undefined) {
        Allperson.push({
          user_id: person.user_id,
          username: person.username,
          blocked: (<{[x: string]: string}>blocked)[person.user_id] !== undefined
        });
      }
    }
    return Allperson;
  }

  async getSelf(userID: string) {
    const person = await peopleModel.findByUserID(userID);
    if (!person)
      throw new InternalServerError("user not existe on database");
    return person;
  }

  async search(userId: string , value: string) {
    return peopleModel.findByUsername(userId, value);
  }
}

export const peopleServices = new PeopleServices();
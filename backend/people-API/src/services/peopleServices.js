import { UnauthorizedError } from "@transcenduck/error"

export class PeopleServices {
  peopleModel;

  constructor(peopleModel) {
    this.peopleModel = peopleModel;
  }

  async getAll(userID) {
    if (!userID) {
      throw new UnauthorizedError('User ID is required');
    }
    const AllpersonDB = await this.peopleModel.findAll(userID);
    if (!AllpersonDB) {
      throw new UnauthorizedError('Person not found');
    }
    const {friends, blocked = {}, pending = {}} = await this.peopleModel.findByUserID(userID, true, ['friends', 'blocked', 'pending']);
    const Allperson = [];
    for(const person of AllpersonDB) {
      if (person.user_id != userID && friends[person.user_id] === undefined && pending[person.user_id] === undefined) {
        person.blocked = blocked[person.user_id] !== undefined;
        Allperson.push(person);
      }
    }
    return Allperson;
  }

  async getSelf(userID) {
    if (!userID) {
      throw new UnauthorizedError('User ID is required');
    }

    const person = await this.peopleModel.findByUserID(userID);
    if (!person) {
      throw new UnauthorizedError('Person not found');
    }

    return person;
  }

  async search(value) {
    return this.peopleModel.findByUsername(value);
  }
}
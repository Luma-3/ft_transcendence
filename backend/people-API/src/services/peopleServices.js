import { UnauthorizedError } from "@transcenduck/error"

export class PeopleServices {
  peopleModel;

  constructor(peopleModel) {
    this.peopleModel = peopleModel;
  }

  async getAll(option) {
    return await this.peopleModel.findAll()
  }

  async search(value) {
    return this.peopleModel.findByUsername(value);
  }
}
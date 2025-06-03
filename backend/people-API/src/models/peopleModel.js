const Base_Schema = ['friends', 'blocked', 'pending', 'user_id', 'username']; 

export class PeopleModel {
  knex;
  constructor(knex) {
    this.knex = knex;
  }

  async create(userID, data, schema = Base_Schema) {
    return this.knex('people')
      .insert({
        user_id: userID,
        ...data
      }, schema);
  }

  async findByUserID(userID, schema = Base_Schema) {
    return await this.knex('people')
      .select(schema)
      .where('user_id', userID)
      .first()
  }

  async updateUsername(userID, username, schema = Base_Schema) {
    return await this.knex('people')
      .select(schema)
      .where('user_id', userID)
      .update({ username }, schema);
  }


  async acceptPending(userID, pending, schema = Base_Schema) {
    return await this.knex.transaction(async (trx) => {
      await Promise.all([
        await this.addFriend(trx, userID, pending, schema),
        await this.addFriend(trx, pending, userID, schema),
        await this.removePending(trx, userID, pending),
        await this.removePending(trx, pending, userID)
      ]);
    });
  }

  async addFriend(trx, userID, friends, schema = Base_Schema) {
    return trx('people')
          .where('user_id', userID)
          .update({
            friends: trx.jsonSet('friends', "$." + friends, "")
          });
  }

  async removeFriends(userID, friends, schema = Base_Schema) {
    return await this.knex.transaction(async (trx) => {
      await this.removeFriend(trx, userID, friends, schema);
      await this.removeFriend(trx, friends, userID, schema);
    });
  }

  async removeFriend(trx, userID, friends, schema = Base_Schema) {
    return await trx('people')
      .where('user_id', userID)
      .update({
        friends: trx.jsonRemove('friends', "$." + friends)
      });
  }

  async blockUser( userID, blocked, schema = Base_Schema) {
    return await this.knex('people')
      .where('user_id', userID)
      .jsonSet('blocked', "$." + blocked, {blocked});
  }

  async unBlockUser(userID, blocked, schema = Base_Schema) {
    return await this.knex('people')
      .where('user_id', userID)
      .jsonRemove('blocked', "$." + blocked);
  }

  async sendPending(userID, pending, schema = Base_Schema) {
    
    const test = {};
    return await this.knex.transaction(async (trx) => {
      await Promise.all([
        await this.addPending(trx, userID, pending, "sender"),
        await this.addPending(trx, pending, userID, "receiver"),
      ]);
    });
  }

  async addPending(trx, userID, pending,action) {
    return trx('people')
          .where('user_id', userID)
          .update({ pending: trx.jsonSet('pending', "$." + pending, action)});
  }

  async removePending(trx, userID, pending, schema = Base_Schema) {
    return trx('people')
          .where('user_id', userID)
          .update({ pending: trx.jsonRemove('pending', "$." + pending) });
  }

  async hasPending(userID, pending) {
    const result = await this.knex('people')
      .select('pending')
      .where('user_id', userID)
      .jsonExtract('pending', "$." + pending)
      .first();
    result.pending = JSON.parse(result.pending);
    if (!result || !result.pending) return false;
    return result.pending[pending] !== undefined;
  }

  async typePending(userID, pending) {
    const result = await this.knex('people')
      .select('pending')
      .where('user_id', userID)
      .first();
    result.pending = JSON.parse(result.pending);
    if (!result || !result.pending) return null;
    return result.pending[pending] || null;
  }

  async delete(userID) {
    return await this.knex('people')
      .where('user_id', userID)
      .del('user_id');
  }
  async findAll(schema = Base_Schema) {
    return await this.knex('people')
      .select(["user_id", "username"]);
  }
  async findByUsername(username, schema = Base_Schema) {
    return await this.knex('people')
      .select(["user_id", "username"])
      .whereLike('username', `${username}%`);
  }
}

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


  async findByUserID(userID, raw = false, schema = Base_Schema) {
    const result = await this.knex('people')
      .select(schema)
      .where('user_id', userID)
      .first();
    if (!result) {
      return null;
    }
    if (raw) {
      result.friends = JSON.parse(result.friends ?? '{}');
      result.blocked = JSON.parse(result.blocked ?? '{}');
      result.pending = JSON.parse(result.pending ?? '{}');
      return result;
    }
    if(result.friends !== null && result.friends !== undefined) {
      const friends = [];
      for( const friend of Object.keys(JSON.parse(result.friends ?? '{}'))) {
        friends.push(this.findByUserID(friend, ['user_id', 'username']));
      }
      result.friends = await Promise.all(friends);
    }
    if(result.blocked !== null && result.blocked !== undefined) {
      const blocked = [];
      for( const block of Object.keys(JSON.parse(result.blocked ?? '{}'))) {
        blocked.push(this.findByUserID(block, ['user_id', 'username']));
      }
      result.blocked = await Promise.all(blocked);
    }
    if(result.pending !== null && result.pending !== undefined) {
      const peddingDB = JSON.parse(result.pending ?? '{}');
      const pending = [];
      for( const pend of Object.keys(peddingDB)) {
        pending.push({
          ...(await this.findByUserID(pend, ['user_id', 'username'])),
            status: peddingDB[pend]
        });
      }
      result.pending = pending;
    }
    return result;
  }

  async updateUsername(userID, username, schema = Base_Schema) {
    return await this.knex('people')
      .select(schema)
      .where('user_id', userID)
      .update({ username }, schema);
  }

  async getFriends(userID, schema = Base_Schema) {
    const { friends } = await this.knex('people')
      .select('friends')
      .where('user_id', userID)
      .first();
    if (!friends) return [];
    return Object.keys(JSON.parse(friends));
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

    async refuseFriend(userID, pending, schema = Base_Schema) {
    return await this.knex.transaction(async (trx) => {
      await Promise.all([
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
    console.log("Removing friends:", userID, friends);
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

  async getBlocked(userID, schema = Base_Schema) {
    const { blocked } = await this.knex('people')
      .select('blocked')
      .where('user_id', userID)
      .first();
    if (!blocked) return [];
    return Object.keys(JSON.parse(blocked));
  }

  async blockUser( userID, blocked, schema = Base_Schema) {
    return await this.knex('people')
      .where('user_id', userID).update({
        blocked: this.knex.jsonSet('blocked', "$." + blocked, "")
      });
  }

  async unBlockUser(userID, blocked, schema = Base_Schema) {
    return await this.knex('people')
      .where('user_id', userID).update({
        blocked: this.knex.jsonRemove('blocked', "$." + blocked)
      });
  }

  async sendPending(userID, pending, schema = Base_Schema) {
    
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

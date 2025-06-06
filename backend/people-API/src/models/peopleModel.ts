import { Knex } from "knex";
import { BlockedSelfReponseType, FriendsBaseType, FriendSelfReponseType, PendingSelfReponseType, PeoplesDBBaseType, ResponsePublicType, ResponseSelfType, type PeoplesSchemaType } from "../schema/people.schema";
import knex from "../utils/knex";

export const PeopleSchemaDBPrivate: PeoplesSchemaType = ["user_id", "username", "friends", "blocked", "pending"];
export const PeopleSchemaSelfDBPublic: PeoplesSchemaType = ["user_id", "username", "friends", "blocked", "pending"];
export const PeopleSchemaDBPublic: PeoplesSchemaType = ["user_id", "username"];

export class PeopleModel {

  async create(userID: string, username: string, schema: PeoplesSchemaType = PeopleSchemaDBPrivate) {
    return knex('people')
      .insert({
        user_id: userID,
        username: username
      }, schema);
  };

  async findByUserID(userID: string,raw: boolean = false, schema: PeoplesSchemaType = PeopleSchemaSelfDBPublic): Promise<ResponseSelfType|null> {
    const result: PeoplesDBBaseType = await knex('people')
      .select(schema)
      .where('user_id', userID)
      .first();
    if (!result) {
      return null;
    }
    const response: ResponseSelfType = {
      user_id: userID,
      username: result.username
    };
    if (raw) {
      response.friends = JSON.parse(result.friends as string);
      response.blocked = JSON.parse(result.blocked as string);
      response.pending = JSON.parse(result.pending as string);
      return response;
    }
    if(result.friends !== null && result.friends !== undefined) {
      const friends : Promise<ResponseSelfType|null>[] = [];
      for( const friend of Object.keys(JSON.parse(result.friends ?? '{}'))) {
        friends.push(this.findByUserID(friend, true, ['user_id', 'username']));
      }
      response.friends = (await Promise.all(friends)).filter((data) => data !== null ).map<FriendSelfReponseType>((c: ResponseSelfType) =>  {
        return {
          user_id: c.user_id,
          username: c.username
        };
      });
    }
    if(result.blocked !== null && result.blocked !== undefined) {
      const blocked : Promise<ResponseSelfType|null>[] = [];
      for( const friend of Object.keys(JSON.parse(result.blocked ?? '{}'))) {
        blocked.push(this.findByUserID(friend, true, ['user_id', 'username']));
      }
      response.blocked = (await Promise.all(blocked)).filter((data) => data !== null ).map<BlockedSelfReponseType>((c: ResponseSelfType) =>  {
        return {
          user_id: c.user_id,
          username: c.username
        };
      });
    }
    if(result.pending !== null && result.pending !== undefined) {
      const peddingDB: Object = JSON.parse(result.pending as string);
      const pending: PendingSelfReponseType[] = [];
      for( const pend of Object.keys(peddingDB)) {
        const data = (await this.findByUserID(pend, false,['user_id', 'username']));
        if(!data)
          continue;
        pending.push({
            user_id: pend,
            username: data?.username!,
            status: peddingDB[pend]
        });
      }
      response.pending = pending;
    }
    return response;
  }

  async updateUsername(userID: string, username: string, schema: PeoplesSchemaType = ['username']) {
    return await knex('people')
      .where('user_id', userID)
      .update({ username }, schema);
  }

  async getFriends(userID: string) {
    const { friends } = await knex('people')
      .select('friends')
      .where('user_id', userID)
      .first();
    if (!friends) return [];
    return Object.keys(JSON.parse(friends));
  }

  async acceptPending(userID: string, pending: string) {
    return await knex.transaction(async (trx) => {
      await Promise.all([
        await this.addFriend(trx, userID, pending),
        await this.addFriend(trx, pending, userID),
        await this.removePending(trx, userID, pending),
        await this.removePending(trx, pending, userID)
      ]);
    });
  }

    async refuseFriend(userID: string, pending: string) {
    return await knex.transaction(async (trx) => {
      await Promise.all([
        await this.removePending(trx, userID, pending),
        await this.removePending(trx, pending, userID)
      ]);
    });
  }

  async addFriend(trx: Knex.Transaction, userID: string, friends: string) {
    return trx('people')
          .where('user_id', userID)
          .update({
            friends: trx.jsonSet('friends', "$." + friends, "")
          });
  }

  async removeFriends(userID: string, friends: string) {
    console.log("Removing friends:", userID, friends);
    return await knex.transaction(async (trx) => {
      await this.removeFriend(trx, userID, friends);
      await this.removeFriend(trx, friends, userID);
    });
  }

  async removeFriend(trx: Knex.Transaction, userID: string, friends: string) {
    return await trx('people')
      .where('user_id', userID)
      .update({
        friends: trx.jsonRemove('friends', "$." + friends)
      });
  }

  async getBlocked(userID: string) {
    const { blocked } = await knex('people')
      .select('blocked')
      .where('user_id', userID)
      .first();
    if (!blocked) return [];
    return Object.keys(JSON.parse(blocked));
  }

  async blockUser( userID: string, blocked: string, action: "sender"|"receiver" = 'sender') {
    return await knex('people')
      .where('user_id', userID).update({
        blocked: knex.jsonSet('blocked', "$." + blocked, action)
      });
  }

  async unBlockUser(userID: string, blocked: string) {
    const result = await knex('people')
      .where('user_id', userID).whereJsonPath('blocked', "$." + blocked, '=',  'sender').update({
        blocked: knex.jsonRemove('blocked', "$." + blocked)
      });
      if(result) {
        await knex('people')
          .where('user_id', blocked).update({
            blocked: knex.jsonRemove('blocked', "$." + userID)
          });
      }
  }

  async sendPending(userID: string, pending: string) {
    
    return await knex.transaction(async (trx) => {
      await Promise.all([
        await this.addPending(trx, userID, pending, "sender"),
        await this.addPending(trx, pending, userID, "receiver"),
      ]);
    });
  }

  async addPending(trx: Knex.Transaction, userID: string, pending: string ,action: string) {
    return trx('people')
          .where('user_id', userID)
          .update({ pending: trx.jsonSet('pending', "$." + pending, action)});
  }

  async removePending(trx: Knex.Transaction, userID: string, pending: string) {
    return trx('people')
          .where('user_id', userID)
          .update({ pending: trx.jsonRemove('pending', "$." + pending) });
  }

  async isBlocked(userId: string, blockedId: string) {
    const results = await knex('people')
    .select('blocked')
    .where("user_id", userId)
    .orWhere("user_id", blockedId) as {blocked: string}[];
    if(results) {
      for (const result of results) {
        const blocked = JSON.parse(result.blocked) as {[block: string]: "sender" | "target"};
        if(blocked[userId] !== undefined || blocked[blockedId] !== undefined)
          return true;
      }
    }
    return false;
  }

  async hasPending(userID: string, pending: string) {
    const result = await knex('people')
      .select('pending')
      .where('user_id', userID)
      .jsonExtract('pending', "$." + pending)
      .first();
    result.pending = JSON.parse(result.pending);
    if (!result || !result.pending) return false;
    return result.pending[pending] !== undefined;
  }

  async typePending(userID: string, pending: string) {
    const result = await knex('people')
      .select('pending')
      .where('user_id', userID)
      .first();
    result.pending = JSON.parse(result.pending);
    if (!result || !result.pending) return null;
    return result.pending[pending] || null;
  }

  async delete(userID: string) {
    return await knex('people')
      .where('user_id', userID)
      .del('user_id');
  }
  async findAll() {
    return await knex('people')
      .select(PeopleSchemaDBPublic) as ResponsePublicType[];
  }
  async findByUsername(userId: string, username: string) {
    return await knex('people')
      .select(PeopleSchemaDBPublic)
      .whereLike('username', `${username}%`).andWhereJsonPath('blocked', "$." + userId, "!=", " sender").andWhereJsonPath('blocked', "$." + userId, "!=", "receiver") as ResponsePublicType[];
  }
}

export const peopleModel = new PeopleModel();
import { FriendDBHydrateType, FriendDBType } from './friends.schema.js';
import { knexInstance, type Knex} from '../utils/knex.js';

export const FRIEND_COLUMNS: string[] = ['id', 'user_id, friend_id'];
export const FRIEND_HYDRATE_COLUMNS: string[] = ['friend_id as id', 'users.username', 'preferences.avatar', 'preferences.banner'];

export class FriendsModel {

  /**
   * Retrieves the list of friends for a given user ID.
   * @param id - The user ID to find friends for.
   * @param columns - The columns to select from the database.
   * @returns A promise that resolves to an array of friends or undefined if no friends are found.
   */
  async findByID(id: string, columns = FRIEND_HYDRATE_COLUMNS): Promise<FriendDBHydrateType[] | undefined> {
      return await knexInstance<FriendDBHydrateType[]>('friends')
        .select(columns)
        .where('friends.user_id', id)
        .join('users', 'friends.friend_id', 'users.id')
        .join('preferences', 'friends.friend_id', 'preferences.user_id');
    
  }

  /**
   * Creates a new friend record in the database.
   * @param trx - The transaction object for database operations.
   * @param id - The user ID to add a friend for.
   * @param friendId - The ID of the friend to be added.
   * @returns A promise that resolves to the created friend record.
   */
  async create(
    trx: Knex.Transaction,
    id: string,
    friendId: string
  ) {
    return await trx<FriendDBType>('friends').insert({
      user_id: id,
      friend_id: friendId
    });
  }

  /**
   * Deletes a friend record from the database.
   * @param trx - The transaction object for database operations.
   * @param id - The user ID to remove a friend from.
   * @param friendId - The ID of the friend to be removed.
   * @returns A promise that resolves when the friend is removed.
   */
  async delete(trx: Knex.Transaction, id: string, friendId: string) {
    return await trx<FriendDBType>('friends')
      .where('user_id', id)
      .andWhere('friend_id', friendId)
      .del();
  }

}


export const friendsModel = new FriendsModel();
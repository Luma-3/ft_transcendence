import { BlockedDBHydrateType, BlockedDBType } from './schema.js';
import { knexInstance, type Knex} from '../utils/knex.js';

export const BLOCKED_COLUMNS: string[] = ['user_id', 'blocked_id'];
export const BLOCKEDPENDING_HYDRATE_COLUMNS: string[] = ['blocked_id as id', 'users.username', 'preferences.avatar', 'preferences.banner'];
export const BLOCKEDPENDING_COLUMNS: string[] = ['blocked_id as id'];

export class BlockedModel {

  /**
   * Retrieves the list of friends for a given user ID.
   * @param id - The user ID to find friends for.
   * @param columns - The columns to select from the database.
   * @returns A promise that resolves to an array of friends or undefined if no friends are found.
   */
  async findByID(id: string, hydrate: boolean = false): Promise<BlockedDBHydrateType[] | undefined> {
      const query = knexInstance<BlockedDBHydrateType, BlockedDBHydrateType>('blocked')
          .select(hydrate ? BLOCKEDPENDING_HYDRATE_COLUMNS : BLOCKEDPENDING_COLUMNS)
          .where('blocked.user_id', id);
      if(hydrate){
         query 
          .join('users', 'blocked.blocked_id', 'users.id')
          .join('preferences', 'blocked.blocked_id', 'preferences.user_id');
      }
      return (await query);
  }

  /**
   * Creates a new friend record in the database.
   * @param trx - The transaction object for database operations.
   * @param id - The user ID to add a friend for.
   * @param pendingId - The ID of the friend to be added.
   * @returns A promise that resolves to the created friend record.
   */
  async create(
    trx: Knex.Transaction,
    id: string,
    pendingId: string
  ) {
    return await trx<BlockedDBType>('blocked').insert({
      user_id: id,
      blocked_id: pendingId
    }, BLOCKED_COLUMNS);
  }

  /**
   * Deletes a friend record from the database.
   * @param trx - The transaction object for database operations.
   * @param id - The user ID to remove a friend from.
   * @param pendingId - The ID of the friend to be removed.
   * @returns A promise that resolves when the friend is removed.
   */
  async delete(trx: Knex.Transaction, id: string, pendingId: string) {
    return await trx<BlockedDBType>('blocked')
      .where('user_id', id)
      .andWhere('blocked_id', pendingId)
      .del();
  }

  async exists(trx: Knex.Transaction, id: string, pendingId: string): Promise<boolean> {
    console.log(`Checking if pending request exists for user ${id} and pending ID ${pendingId}`);
    const count = await trx('blocked')
      .select('id')
      .where('user_id', id)
      .andWhere('blocked_id', pendingId)
      .count('* as count')
      .first();
    return count !== undefined && (count.count as number) > 0;
  }

}


export const blockedModel = new BlockedModel();
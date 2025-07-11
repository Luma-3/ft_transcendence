import { PendingDBHydrateType, PendingDBType } from './schema.js';
import { knexInstance, type Knex} from '../utils/knex.js';

export const PENDING_COLUMNS: string[] = ['user_id', 'pending_id'];
export const PENDING_SENDER_HYDRATE_COLUMNS: string[] = ['pending_id as id', 'users.username', 'preferences.avatar', 'preferences.banner'];
export const PENDING_RECEIVER_HYDRATE_COLUMNS: string[] = ['pending.user_id as id', 'users.username', 'preferences.avatar', 'preferences.banner'];

export class PedingModel {

  /**
   * Retrieves the list of friends for a given user ID.
   * @param id - The user ID to find friends for.
   * @param columns - The columns to select from the database.
   * @returns A promise that resolves to an array of friends or undefined if no friends are found.
   */
  async findByID(id: string, action: ("sender" | "receiver") = "sender"): Promise<PendingDBHydrateType[] | undefined> {
      if (action === "sender") {
      console.log(`Fetching pending requests for user ${id} as sender`);
        return await knexInstance<PendingDBHydrateType[]>('pending')
          .select(PENDING_SENDER_HYDRATE_COLUMNS)
          .where('pending.user_id', id)
          .join('users', 'pending.pending_id', 'users.id')
          .join('preferences', 'pending.pending_id', 'preferences.user_id');
      }
      console.log(`Fetching pending requests for user ${id} as receiver`);
      return await knexInstance<PendingDBHydrateType[]>('pending').
        select(PENDING_RECEIVER_HYDRATE_COLUMNS)
        .where('pending.pending_id', id)
        .join('users', 'pending.user_id', 'users.id')
        .join('preferences', 'pending.user_id', 'preferences.user_id');
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
    return await trx<PendingDBType>('pending').insert({
      user_id: id,
      pending_id: pendingId
    }, PENDING_COLUMNS);
  }

  /**
   * Deletes a friend record from the database.
   * @param trx - The transaction object for database operations.
   * @param id - The user ID to remove a friend from.
   * @param pendingId - The ID of the friend to be removed.
   * @returns A promise that resolves when the friend is removed.
   */
  async delete(trx: Knex.Transaction, id: string, pendingId: string) {
    return await trx<PendingDBType>('pending')
      .where('user_id', id)
      .andWhere('pending_id', pendingId)
      .del();
  }

  async exists(trx: Knex.Transaction, id: string, pendingId: string): Promise<boolean> {
            console.log(`Checking if pending request exists for user ${id} and pending ID ${pendingId}`);
    const count = await trx('pending')
      .select('id')
      .where('user_id', id)
      .andWhere('pending_id', pendingId)
      .count('id as count')
      .first();
    console.log(count);
    return count !== undefined && (count.count as number) > 0;
  }

}


export const pendingModel = new PedingModel();
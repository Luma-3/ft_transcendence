import { PendingDBHydrateType, PendingDBType } from './schema.js';
import { knexInstance, type Knex} from '../utils/knex.js';

export const PENDING_COLUMNS: string[] = ['user_id', 'pending_id'];
export const PENDING_SENDER_HYDRATE_COLUMNS: string[] = ['pending_id as id'];
export const PENDING_RECEIVER_HYDRATE_COLUMNS: string[] = ['pending.user_id as id'];

export class PedingModel {

  /**
   * Retrieves the list of friends for a given user ID.
   * @param id - The user ID to find friends for.
   * @param columns - The columns to select from the database.
   * @returns A promise that resolves to an array of friends or undefined if no friends are found.
   */
  async findByID(id: string, action: ("sender" | "receiver") = "sender"): Promise<PendingDBHydrateType[] | undefined> {
      if (action === "sender") {
        return await knexInstance<PendingDBHydrateType, PendingDBHydrateType>('pending')
          .select(PENDING_SENDER_HYDRATE_COLUMNS)
          .where('pending.user_id', id);
      }
      return await knexInstance<PendingDBHydrateType, PendingDBHydrateType>('pending').
        select(PENDING_RECEIVER_HYDRATE_COLUMNS)
        .where('pending.pending_id', id);
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
    pendingId: string,
    roomId: string
  ) {
    return await trx<PendingDBType>('pending').insert({
      user_id: id,
      pending_id: pendingId,
      room_id: roomId
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
      .andWhere('pending_id', pendingId).del();
  }

  async deleteByRoomId(trx: Knex.Transaction, roomId: string): Promise<PendingDBHydrateType | null> {
    return trx<PendingDBType>('pending')
      .where('room_id', roomId)
      .del();
  }

  async findRoomByUserIdAndPendingId(trx: Knex.Transaction, id: string, pendingId: string): Promise<Omit<PendingDBType, 'user_id' | 'pending_id'> | undefined> {
    return await trx<PendingDBType>('pending')
      .select(['room_id'])
      .where('pending.user_id', id)
      .andWhere('pending.pending_id', pendingId)
      .first<Omit<PendingDBType, 'user_id' | 'pending_id'>>();
  }

  async findByRoomId(roomId: string): Promise<Omit<PendingDBType, 'room_id'> | undefined> {
    return await knexInstance<PendingDBType>('pending')
      .select(PENDING_COLUMNS)
      .where('pending.room_id', roomId).first<Omit<PendingDBType, 'room_id'>>();
  }

  async existsByRoomId(trx: Knex.Transaction, roomId: string): Promise<boolean> {
    const count = await trx('pending')
      .select('id')
      .where('room_id', roomId)
      .count('* as count').first();
    return count !== undefined && (count.count as number) > 0;
  }

  async exists(trx: Knex.Transaction, id: string, pendingId: string): Promise<boolean> {
    const count = await trx('pending')
      .select('id')
      .where('user_id', id)
      .andWhere('pending_id', pendingId)
      .count('id as count')
      .first();
    return count !== undefined && (count.count as number) > 0;
  }

}


export const pendingModel = new PedingModel();
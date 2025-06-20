import { SearchDBHydrateType } from './search.schema.js';
import { knexInstance} from '../utils/knex.js';

export const SEARCH_USER_PUBLIC_COLUMNS: string[] = ['users.id', 'username'];

export class SearchModel {

  /**
   * Retrieves a list of users based on a search query.
   * @param userId - The ID of the user performing the search.
   * @param q - The search query string.
   * @param page - The page number for pagination (default is 1).
   * @param limit - The number of results per page (default is 10).
   * @param hydrate - Whether to include additional user information (default is true).
   * @param columns - The columns to select from the database (default is USER_PUBLIC_COLUMNS).
   * @returns A promise that resolves to an array of search results.
   */
  async search(userId: string, q:string, page: number = 1, limit: number = 10, hydrate: boolean = true, columns = SEARCH_USER_PUBLIC_COLUMNS) {
    const query =  knexInstance<SearchDBHydrateType>('users')
      .select(hydrate ? [...columns, 'preferences.avatar', 'preferences.banner'] : columns)
      .join('preferences', 'users.id', 'preferences.user_id')
      .where('users.id', "!=", userId)
      .andWhere('users.username', 'like', `${q}%`)
      query.leftJoin('blocked as blocked_to', function () {
        this.on('users.id', '=', 'blocked_to.blocked_id').andOn('blocked_to.user_id', '=', knexInstance.raw('?', [userId]));
      }).whereNull('blocked_to.id')
      .limit(limit)
      .offset((page - 1) * limit);
    return (await query) as SearchDBHydrateType[];
  }

}


export const searchModel = new SearchModel();
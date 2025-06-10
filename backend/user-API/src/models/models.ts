import { knexInstance } from '../utils/knex.js';
import { UserModel } from './userModel.js';
import { PreferencesModel } from './preferencesModel.js';

export const userModel = new UserModel(knexInstance);
export const preferencesModel = new PreferencesModel(knexInstance);


export { knexInstance };

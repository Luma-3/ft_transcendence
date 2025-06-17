import { knexInstance } from '../utils/knex.js';
import { UserModel } from '../users/user.model.js';
import { PreferencesModel } from '../preferences/preferences.model.js';

export const userModel = new UserModel();
export const preferencesModel = new PreferencesModel(knexInstance);


export { knexInstance };

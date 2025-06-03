import knex from '../utils/knex';
import { UserModel } from './userModel';
import { PreferencesModel } from './preferencesModel';

export const userModel = new UserModel(knex);
export const preferencesModel = new PreferencesModel(knex);


export { knex };

import knex from '../config/knex';
import { UserModel } from './userModel';
import { PreferencesModel } from './preferencesModel';

export const userModel = new UserModel(knex);
export const preferencesModel = new PreferencesModel(knex);


export { knex };

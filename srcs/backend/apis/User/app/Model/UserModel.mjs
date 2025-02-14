export class UserModel {
	constructor(knex) {
		this.knex = knex
	}

	async getAllUsers() {
		return this.knex('users').select('*')
	}
}
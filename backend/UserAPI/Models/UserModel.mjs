export class UserModel {
	constructor(knex) {
		this.knex = knex
	}

	static Base_Schema = ['id', 'username', 'created_at']

	/**
	 * @var id
	 * @var username
	 * @var password
	 * @var created_at
	 */

	async findAll(schema = Base_Schema) {
		return await this.knex('users')
			.select(schema)
		
	}

	async findByID(ID , schema = Base_Schema) {
		return await this.knex('users')
			.select(schema)
			.where('id', ID)
	}

	async findByUsername(username, schema = Base_Schema)
	{
		return this.knex('users')
			.select(schema)
			.where('username', username)
			.first();
	}

	async insert(username, password) {
		return this.knex('users').insert({username, password, created_at: this.knex.fn.now()});
	}
}
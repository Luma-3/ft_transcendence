import fastify from "fastify";

const NewUserSchema = {
	body: {
		type: 'object',
		required: ['username', 'email'],
		properties: {
			username: { type: 'string', minLength: 2, maxLength: 32},
			password: { type: 'string', minLength: 8, maxLength: 255},
			email: {type: 'string', format: 'email', maxLength: 255}
		}
	}
}

const LoginUserSchema = {
	body: {
		type: 'object',
		required: ['username', 'password'],
		properties: {
			username: { type: 'string', minLength: 2, maxLength: 32},
			password: { type: 'string', minLength: 8, maxLength: 255}
		}
	}
}

export default class UserModel {
	constructor(knex) {
		this.knex = knex
	}

	/**
	 * @var ID
	 * @var Username
	 * @var HashPassword
	 * @var email
	 */

	async findAll() {
		return await this.knex('users')
			.select('*')
		
	}
	async findByID(ID) {
		return this.knex('users')
			.where(ID, userId)
			.first();
	}

	async findByUsername(username)
	{
		return this.knex('users')
			.where('username', username)
			.first();
	}

	async insert(username, password, email) {
		return this.knex('users').insert({username, password, email, created_at: this.knex.fn.now()});
	}
}

export { NewUserSchema , LoginUserSchema };

const UserSchema = {
	body: {
		type: 'object',
		required: ['username', 'email'],
		properties: {
			name: { type: 'string', minLength: 2, maxLength: 32},
			email: {type: 'string', format: 'email', maxLength: 255}
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

	static COLUMNS = {
		ID: 'id',
		USERNAME: 'username',
		PASSWORD: 'password',
		EMAIL: 'email',
	}

	async findAll() {
		return await this.knex('users')
			.select('*')
		
	}

	// 
	async findByID(ID) {
		return this.knex('users')
			.where(ID, userId)
			.first();
	}

	async insert(username, email) {
		return this.knex('users').insert({username, email});
	}
}

export { UserSchema };
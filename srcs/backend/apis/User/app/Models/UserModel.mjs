export class UserModel {
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
}

export default UserModel
import UserModel from "../Models/UserModel.mjs"

const getAllUser = async (request, reply) => {
	try {
		reply.send(UserModel.findAll())
	}
	catch (err) {
		reply.send(err);
	}
}

export default {
	getAllUser
};
import { FastifyReply, FastifyRequest } from "fastify";
import { friendsServices } from "../services/friendsServices";
import { FriendsParamType, GatewayHeaderType } from "../schema/people.schema";

export async function addFriend(req: FastifyRequest<{
	Params: FriendsParamType,
	Headers: GatewayHeaderType
}>, res: FastifyReply) {
	const userId = req.headers['x-user-id'];
	const { friendId } = req.params;
	await friendsServices.addFriend(userId, friendId);
	return res.status(200).send({ status: "success", message: "Friend added successfully" });
}

export async function removeFriend(req: FastifyRequest<{
	Params: FriendsParamType,
	Headers: GatewayHeaderType
}>, res: FastifyReply) {
	const userId = req.headers['x-user-id'];
	const { friendId } = req.params;
	await friendsServices.removeFriend(userId, friendId);
	return res.status(200).send({ status: "success", message: "Friend removed successfully" });
}

export async function refuseFriend(req: FastifyRequest<{
	Params: FriendsParamType,
	Headers: GatewayHeaderType
}>, res: FastifyReply) {
	const userId = req.headers['x-user-id'];
	const { friendId } = req.params;
	await friendsServices.refuseFriend(userId, friendId);
	return res.status(200).send({ status: "success", message: "Friend request refused successfully" });
}
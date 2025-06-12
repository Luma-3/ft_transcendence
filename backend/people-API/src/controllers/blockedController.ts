import { FastifyReply, FastifyRequest } from "fastify";
import { blockedServices } from "../services/blockedServices.js";
import { BlockedParamType, GatewayHeaderType } from "../schema/people.schema.js";

export async function blockUser(req: FastifyRequest<{ 
	Params: BlockedParamType,
	Headers: GatewayHeaderType
}>, res: FastifyReply) {
	const userId = req.headers['x-user-id'];
	const { blockedId } = req.params;
	await blockedServices.blockUser(userId, blockedId);
	res.status(200).send({ message: "User blocked successfully" });
}

export async function unBlockUser(req: FastifyRequest<{ 
	Params: BlockedParamType,
	Headers: GatewayHeaderType
}>, res: FastifyReply) {
	const userId = req.headers['x-user-id'];
	const { blockedId } = req.params;
	await blockedServices.unblockUser(userId, blockedId);
	res.status(200).send({ message: "User unblocked successfully" });
}
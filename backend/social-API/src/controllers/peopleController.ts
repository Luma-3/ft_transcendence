import { FastifyReply, FastifyRequest } from "fastify";
import { GatewayHeaderType, type SearchGetType } from "../schema/people.schema.js";
import { peopleServices } from "../services/peopleServices.js";
import { BadRequestError, NotFoundError } from "@transcenduck/error";
import { Not } from "@sinclair/typebox";

export async function getAll(req: FastifyRequest<{
	Headers: GatewayHeaderType
}>, res: FastifyReply) {
	const userID = req.headers['x-user-id'];
	const data = await peopleServices.getAll(userID);
	return res.status(200).send({ status: "success", data});
}

export async function getSelf(req: FastifyRequest<{
	Headers: GatewayHeaderType
}>, res: FastifyReply) {
	const userID = req.headers['x-user-id'];
	if (!userID) throw new BadRequestError('User ID is required');
	
	const person = await peopleServices.getSelf(userID);
	if (!person) {
		throw new NotFoundError('')
		return res.status(404).send({ status: "error", message: "Person not found" });
	}
	return res.status(200).send({ status: "success", data: person });
}

export async function search(req: FastifyRequest<{
	Querystring: SearchGetType, 
	Headers: GatewayHeaderType
}>, res: FastifyReply) {
	const userID = req.headers['x-user-id'];
	const { search } = req.query;
	const data = await peopleServices.search(userID, search);
	return res.status(200).send({ status: "success", data});
}

import { FastifyReply, FastifyRequest } from "fastify";
import { type SearchGetType } from "../schema/people.schema";

export async function getAll(req: FastifyRequest, res: FastifyReply) {
	const userID = req.headers['x-user-id'];
	if (!userID) {
		return res.status(400).send({ status: "error", message: "User ID is required" });
	}
	return res.status(200).send({ status: "success", data : await this.peopleServices.getAll(userID) });
}

export async function getSelf(req: FastifyRequest, res: FastifyReply) {
	const userID = req.headers['x-user-id'];
	if (!userID) {
		return res.status(400).send({ status: "error", message: "User ID is required" });
	}
	
	const person = await this.peopleServices.getSelf(userID);
	if (!person) {
		return res.status(404).send({ status: "error", message: "Person not found" });
	}
	return res.status(200).send({ status: "success", data: person });
}

export async function search(req: FastifyRequest<{Querystring: SearchGetType}>, res: FastifyReply) {
	const userID = req.headers['x-user-id'];
	if (!userID) {
		return res.status(400).send({ status: "error", message: "User ID is required" });
	}
	const { search } = req.query;
	if (!search) {
		return res.status(400).send({ status: "error", message: "Search query is required" });
	}
	
	return res.status(200).send({ status: "success", data: await this.peopleServices.search(userID, search) });
}

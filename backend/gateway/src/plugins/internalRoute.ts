import { ForbiddenError } from "@transcenduck/error"
import { FastifyRequest } from "fastify";

export const internalRoutes = async (req: FastifyRequest) => {
  const route = req.url;
  if (route.includes("/internal/")) {
    throw new ForbiddenError("Access to internal routes is forbidden");
  }
  console.log(`[${req.method}] ${req.url}`);
  return;
};


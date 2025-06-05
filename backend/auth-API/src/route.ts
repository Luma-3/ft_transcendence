import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";

const route: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.get('/', {

  }, async (req, rep) => {

  });
}

export default route;

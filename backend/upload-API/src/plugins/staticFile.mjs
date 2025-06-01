import staticFile from "@fastify/static";
import path from "path";

export default async function(fastify) {
  const __dirname = import.meta.dirname;
  await fastify.register(staticFile, {
    root: path.join(__dirname, '../uploads/'),
    prefix: '/uploads/', // optional: default '/'
  })
}

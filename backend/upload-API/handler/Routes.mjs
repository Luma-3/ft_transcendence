import * as Controller from './Controller.mjs'

export default async function uplaodRoute(fastify) {
	fastify.post('/internal/uploadfile', {

	}, Controller.uplaodFile);

  fastify.delete('/internal/:filename', {

  }, Controller.deleteFile);
}

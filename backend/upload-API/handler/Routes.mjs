import * as Controller from './Controller.mjs'

export default async function uplaodRoute(fastify) {
	fastify.post('/uploadfile', {

	}, Controller.uplaodFile);

  // fastify.get('/uploads/:filename', {
  //
  // }, Controller.get_file);
}

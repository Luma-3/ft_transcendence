import * as Constroller from './Controller.mjs'

export default async function uplaodRoute(fastify) {
	fastify.post('/uploadfile', {

	}, Constroller.uplaodFile)
}
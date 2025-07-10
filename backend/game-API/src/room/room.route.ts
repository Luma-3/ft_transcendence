import { FastifyRequest, FastifyReply } from 'fastify';
import { RoomService } from './room.service.js';
import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { Player } from '../core/runtime/Interface.js';

import { ResponseSchema } from '../utils/schema.js';
import { RoomInfoSchema } from './player.schema.js';
import { PlayerInitialType } from './player.schema.js';
import { InternalServerErrorResponse } from '@transcenduck/error';
import { PlayerInitialSchema, GameIdSchema, HeaderBearer } from './player.schema.js';


const route: FastifyPluginAsyncTypebox = async (fastify) => {

	fastify.post('/rooms/join', {
		schema: {
			body: PlayerInitialSchema,
			headers: HeaderBearer,
			response: {
				201: ResponseSchema(GameIdSchema, 'Player added to room'),
				500: InternalServerErrorResponse
			}
		}
	}, async (req: FastifyRequest<{ Body: PlayerInitialType }>, rep: FastifyReply) => {

		const { playerName, gameType, gameName } = req.body;
		const user_id = req.headers['x-user-id'] as string;

		/**
		 * Verification si le joueur est deja dans une partie
		 * Renvoie le roomId d'une nouvelle room ou d'une room existante
		*/
		const player = new Player(user_id, playerName);


		const roomId = RoomService.joinOrCreateRoom(player, gameName, gameType);
		if (!roomId) {
			return rep.code(403).send({
				message: "Player already locked a Room",
				data: { id: '' }
			});
		}

		return rep.code(201).send({
			message: 'Room found or create for player',
			data: { id: roomId }
		});
	});

	fastify.get('/rooms/:game_id', {
		schema: {
			params: GameIdSchema,
			response: {
				200: ResponseSchema(RoomInfoSchema, 'Room info retrieved'),
				500: InternalServerErrorResponse
			}
		}
	}, async (req, rep) => {
		const roomId = req.params.id;
		const room = RoomService.getRoomById(roomId);

		return rep.code(200).send({
			message: 'Room info retrieved',
			data: room.toJSON()
		});
	});

	fastify.post('/rooms/', 
		{
			schema: {
				body: PlayerInitialSchema,
				headers: HeaderBearer,
				response: {
					201: ResponseSchema(GameIdSchema, 'Private room created'),
					500: InternalServerErrorResponse
			}
		}
	}, async (req: FastifyRequest<{ Body: PlayerInitialType }>, rep: FastifyReply) => {
		const { playerName } = req.body;
		const user_id = req.headers['x-user-id'] as string;

		const player = new Player(user_id, playerName);
		const room = RoomService.createPrivateRoom(player);

		return rep.code(201).send({
			message: 'Private room created',
			data: { id: room }
		});
	});


	 fastify.post('/rooms/:roomId', {
		schema: {
			body: PlayerInitialSchema,
			params: GameIdSchema,
			headers: HeaderBearer,
			response: {
				201: ResponseSchema(GameIdSchema, 'Player joined pr'),
				500: InternalServerErrorResponse
			}
		}
	}, async (req, rep) => {
		const { playerName } = req.body;
		const roomId = req.params.id;
		
		const player = new Player(req.headers['x-user-id'] as string, playerName);
		
		RoomService.joinRoom(player, roomId);
		
		return rep.code(200).send({
			message: 'Private room joined',
			data: { id: roomId }
		});
	});
}

export default route;

import { Static, Type } from "@sinclair/typebox";

export const PlayerInfoSchema = Type.Object({
	playerId: Type.String({
		format: "uuid",
		description: "Unique identifier for the player, formatted as a UUID",
		examples: ["123e4567-e89b-12d3-a456-426614174001"]
	}),
	gameName: Type.String({
		description: "Name of the player in the game",
		examples: ["Player1"]
	}),
	ready: Type.Boolean()
});
export type PlayerInfoType = Static<typeof PlayerInfoSchema>;

export const PlayersInfoSchema = Type.Array(Type.Object({
	user_id: Type.String({
		format: "uuid",
		description: "Unique identifier for the player, formatted as a UUID",
		examples: ["123e4567-e89b-12d3-a456-426614174001"]
	}),
	player_name: Type.String({
		description: "Name of the player in the game",
		examples: ["Player1"]
	}),
	ready: Type.Boolean()
}));
export type PlayersInfoType = Static<typeof PlayersInfoSchema>;

export const PlayerSchema = Type.Object({
	playerId: Type.String({
		format: "uuid",
		description: "Unique identifier for the player, formatted as a UUID",
		examples: ["123e4567-e89b-12d3-a456-426614174001"]
	}),
	gameName: Type.String({
		description: "Name of the player in the game",
		examples: ["Player1"]
	}),
	clientId: Type.String(),
	joined: Type.Boolean(),
	ready: Type.Boolean(),
	score: Type.Number(),
},
	{
		$id: "Player",
		$comment: "Schema for Player object in the game API"
	});

export type PlayerType = Static<typeof PlayerSchema>;

export const PlayerInitialSchema = Type.Object({
	player_name: Type.String(),
	game_type: Type.Union([
		Type.Literal("localpvp"),
		Type.Literal("localpve"),
		Type.Literal("online"),
		Type.Literal("tournament")
	], {
		description: "Type of game wanted by the player",
	}),
	game_name: Type.String({
		description: "Name of the player in the game",
		examples: ["Player1"]
	}),
	ready: Type.Boolean({
		description: "Indicates if the player is ready to start the game",
		default: false
	})
});
export type PlayerInitialType = Static<typeof PlayerInitialSchema>;

export const HeaderBearer = Type.Object({
	'x-user-id': Type.String({ format: 'uuid' })
})
export type HeaderBearerType = Static<typeof HeaderBearer>;

export const GameIdSchema = Type.Object({
	game_id: Type.String({
		format: 'uuid',
		description: 'Unique identifier for the room, formatted as a UUID'
	})
})
export type GameIdType = Static<typeof GameIdSchema>

export const RoomInfoSchema = Type.Object({
	id: Type.String({ format: 'uuid', description: 'Unique identifier for the room, formatted as a UUID' }),
	game_type: Type.Union([
		Type.Literal("localpvp"),
		Type.Literal("localpve"),
		Type.Literal("online"),
		Type.Literal("tournament")
	], {
		description: "Type of game in the room",
	}),
	players: PlayersInfoSchema,
	status: Type.String({
		description: "Current status of the room",
	}),
})
export type RoomInfoType = Static<typeof RoomInfoSchema>;
import { Static, Type } from "@sinclair/typebox";

export const RoomParametersSchema = Type.Object({
	roomId: Type.String({
		format: "uuid",
		description: "Unique identifier for the room, formatted as a UUID",
		example: "123e4567-e89b-12d3-a456-426614174000"
	}),
})

export type RoomParametersType = Static<typeof RoomParametersSchema>;

export const RoomInfoSchema = Type.Object({
	roomId: Type.String({
		format: "uuid",
		description: "Unique identifier for the room, formatted as a UUID",
		example: "123e4567-e89b-12d3-a456-426614174000"
	}),
	typeGame: Type.Union([
		Type.Literal("localpvp"),
		Type.Literal("localpve"),
		Type.Literal("online"),
		Type.Literal("tournament")
	], {
		description: "Type of game being played in the room",
		example: "localpvp"
	}),
	players: Type.Array(Type.Object({
		playerId: Type.String({
			format: "uuid",
			description: "Unique identifier for the player, formatted as a UUID",
			example: "123e4567-e89b-12d3-a456-426614174001"
		}),
		gameName: Type.String({
			description: "Name of the player in the game",
			example: "Player1"
		}),
		ready: Type.Boolean({
			description: "Indicates if the player is ready to start the game",
			example: true
		})
	}))
})

export type RoomInfoType = Static<typeof RoomInfoSchema>;

export const RoomInfoAllSchema = Type.Object({
	roomId: Type.String({
		format: "uuid",
		description: "Unique identifier for the room, formatted as a UUID",
		example: "123e4567-e89b-12d3-a456-426614174000"
	}),
	name: Type.String({
		description: "Name of the room",
		example: "Room-1"
	}),
	typeGame: Type.Union([
		Type.Literal("localpvp"),
		Type.Literal("localpve"),
		Type.Literal("online"),
		Type.Literal("tournament")
	], {
		description: "Type of game being played in the room",
		example: "localpvp"
	}),
	status: Type.Union([
		Type.Literal("waiting"),
		Type.Literal("roomReady"),
		Type.Literal("readyToStart"),
		Type.Literal("playing"),
		Type.Literal("finished")
	], {
		description: "Current status of the room",
		example: "waiting"
	}),
	players: Type.Array(Type.Object({
		playerId: Type.String({
			format: "uuid",
			description: "Unique identifier for the player, formatted as a UUID",
			example: "123e4567-e89b-12d3-a456-426614174001"
		}),
		gameName: Type.String({
			description: "Name of the player in the game",
			example: "Player1"
		}),
		ready: Type.Boolean({
			description: "Indicates if the player is ready to start the game",
			example: true
		})
	})),
	isFull: Type.Boolean({
		description: "Indicates if the room is full",
		example: false
	}),
	createdAt: Type.String({
		format: "date-time",
		description: "Timestamp when the room was created",
		example: "2023-10-01T12:00:00Z"
	}),
	maxPlayers: Type.Union([
		Type.Literal(1),
		Type.Literal(2),
		Type.Literal(8)
	] ,{
		description: "Maximum number of players allowed in the room",
		example: 2
	})
})

export type RoomInfoAllType = Static<typeof RoomInfoAllSchema>;

export type GameType = 'localpvp' | 'localpve' | 'online' | 'tournament';
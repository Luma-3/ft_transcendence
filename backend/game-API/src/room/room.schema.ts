import { Static, Type } from "@sinclair/typebox";

export const RoomParametersSchema = Type.Object({
	roomId: Type.String({
		format: "uuid",
		description: "Unique identifier for the room, formatted as a UUID",
		examples: ["123e4567-e89b-12d3-a456-426614174000"]
	}),
})

export type RoomParametersType = Static<typeof RoomParametersSchema>;

export const RoomPlayerParametersSchema = Type.Object({
	roomId: Type.String({
		format: "uuid",
		description: "Unique identifier for the room, formatted as a UUID",
		examples: ["123e4567-e89b-12d3-a456-426614174000"]
	}),
	playerId: Type.String({
		format: "uuid",
		description: "Unique identifier for the player, formatted as a UUID",
		examples: ["123e4567-e89b-12d3-a456-426614174000"]
	}),
})

export type RoomPlayerParametersType = Static<typeof RoomPlayerParametersSchema>;

export const RoomInfoSchema = Type.Object({
	roomId: Type.String({
		format: "uuid",
		description: "Unique identifier for the room, formatted as a UUID",
		examples: ["123e4567-e89b-12d3-a456-426614174000"]
	}),
	typeGame: Type.Union([
		Type.Literal("localpvp"),
		Type.Literal("localpve"),
		Type.Literal("online"),
		Type.Literal("tournament")
	], {
		description: "Type of game being played in the room",
		examples: ["localpvp"]
	}),
	players: Type.Tuple([
		Type.Optional(Type.Object({
			playerId: Type.String({
				format: "uuid",
				description: "Unique identifier for the player, formatted as a UUID",
				examples: ["123e4567-e89b-12d3-a456-426614174001"]
			}),
			gameName: Type.String({
				description: "Name of the player in the game",
				examples: ["Player1"]
			})
		})),
		Type.Optional(Type.Object({
			playerId: Type.String({
				format: "uuid",
				description: "Unique identifier for the player, formatted as a UUID",
				examples: ["123e4567-e89b-12d3-a456-426614174002"]
			}),
			gameName: Type.String({
				description: "Name of the player in the game",
				examples: ["Player2"]
			})
		}))
	], {
		description: "A pair of players; each can be undefined if not present"
	})
})

export type RoomInfoType = Static<typeof RoomInfoSchema>;

export const RoomInfoAllSchema = Type.Object({
	roomId: Type.String({
		format: "uuid",
		description: "Unique identifier for the room, formatted as a UUID",
		examples: ["123e4567-e89b-12d3-a456-426614174000"]
	}),
	name: Type.String({
		description: "Name of the room",
		examples: ["Room-1"]
	}),
	typeGame: Type.Union([
		Type.Literal("localpvp"),
		Type.Literal("localpve"),
		Type.Literal("online"),
		Type.Literal("tournament")
	], {
		description: "Type of game being played in the room",
		examples: ["localpvp"]
	}),
	status: Type.Union([
		Type.Literal("waiting"),
		Type.Literal("roomReady"),
		Type.Literal("readyToStart"),
		Type.Literal("playing"),
		Type.Literal("finished")
	], {
		description: "Current status of the room",
		examples: ["waiting"]
	}),
	players: Type.Array(Type.Object({
		playerId: Type.String({
			format: "uuid",
			description: "Unique identifier for the player, formatted as a UUID",
			examples: ["123e4567-e89b-12d3-a456-426614174001"]
		}),
		gameName: Type.String({
			description: "Name of the player in the game",
			examples: ["Player1"]
		}),
		ready: Type.Boolean({
			description: "Indicates if the player is ready to start the game",
			examples: [true]
		})
	})),
	isFull: Type.Boolean({
		description: "Indicates if the room is full",
		examples: [false]
	}),
	createdAt: Type.String({
		format: "date-time",
		description: "Timestamp when the room was created",
		examples: ["2023-10-01T12:00:00Z"]
	}),
	maxPlayers: Type.Union([
		Type.Literal(1),
		Type.Literal(2),
		Type.Literal(8)
	] ,{
		description: "Maximum number of players allowed in the room",
		examples: [2]
	})
})

export type RoomInfoAllType = Static<typeof RoomInfoAllSchema>;

export type GameType = 'localpvp' | 'localpve' | 'online' | 'tournament';
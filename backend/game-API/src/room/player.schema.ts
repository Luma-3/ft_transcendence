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

export type PlayerType = Static<typeof PlayerSchema> | undefined;

export const PlayerInitialSchema = Type.Object({
	playerId: Type.String({
		format: "uuid",
		description: "Unique identifier for the player, formatted as a UUID",
		examples: ["123e4567-e89b-12d3-a456-426614174001"]
	}),
	gameName: Type.String({
		description: "Name of the player in the game",
		examples: ["Player1"]
	}),
	typeGame: Type.Union([
		Type.Literal("localpvp"),
		Type.Literal("localpve"),
		Type.Literal("online"),
		Type.Literal("tournament")
	], {
		description: "Type of game wanted by the player",
		examples: ["localpvp"]
	})
});
export type PlayerInitialType = Static<typeof PlayerInitialSchema>;
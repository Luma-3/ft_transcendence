import { Static, Type } from "@sinclair/typebox";

export const PlayerSchema = Type.Object({
	playerId: Type.String(),
	gameName: Type.String(),
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
	playerId: Type.String({
		format: "uuid",
		description: "Unique identifier for the player, formatted as a UUID",
		example: "123e4567-e89b-12d3-a456-426614174001"
	}),
	gameName: Type.String({
		description: "Name of the player in the game",
		example: "Player1"
	}),
	typeGame: Type.Union([
		Type.Literal("localpvp"),
		Type.Literal("localpve"),
		Type.Literal("online"),
		Type.Literal("tournament")
	], {
		description: "Type of game wanted by the player",
		example: "localpvp"
	})
});
export type PlayerInitialType = Static<typeof PlayerInitialSchema>;
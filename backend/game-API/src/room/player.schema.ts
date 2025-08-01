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
  id: Type.String({
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

export const gameTypeSchema = Type.Union([
  Type.Literal("local"),
  Type.Literal("ai"),
  Type.Literal("online"),
  Type.Literal("tournament")
], {
  description: "Type of game",
});
export type gameType = Static<typeof gameTypeSchema>;

export const PlayerInitialSchema = Type.Object({
  playerName: Type.String(),
  gameType: gameTypeSchema,
  gameName: Type.String({
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
  id: Type.String({
    format: 'uuid',
    description: 'Unique identifier for the room, formatted as a UUID'
  })
})
export type GameIdType = Static<typeof GameIdSchema>

export const RoomInfoSchema = Type.Object({
  id: Type.String({ format: 'uuid', description: 'Unique identifier for the room, formatted as a UUID' }),
  gameType: gameTypeSchema,
  players: PlayersInfoSchema,
  status: Type.String({
    description: "Current status of the room",
  }),
})
export type RoomInfoType = Static<typeof RoomInfoSchema>;



// --- NEW --- //

// export const PrivateRoomSchema = Type.Object({
//   gameName: Type.String({
//     description: "Name of the game for the private room",
//   })
// });
// export type PrivateRoomType = Static<typeof PrivateRoomSchema>;

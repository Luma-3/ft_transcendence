import { Static, Type } from "@sinclair/typebox";

export const RoomBodySchema = Type.Object({
  roomName: Type.String({
    description: "Name of the room",
  }),
  playerName: Type.Optional(Type.String({
    description: "Name of other Local player",
    examples: ["Boby Le canneton"]
  }))
})
export type RoomBodyType = Static<typeof RoomBodySchema>;

export const GameType = Type.Union([
  Type.Literal("online"),
  Type.Literal("ai"),
  Type.Literal("local"),
  Type.Literal("tournament")
]);
export type GameType = Static<typeof GameType>;

export const RoomParamSchema = Type.Object({
  roomType: GameType
})
export type RoomParamType = Static<typeof RoomParamSchema>;

export const HeaderBearerSchema = Type.Object({
  "x-user-id": Type.String({
    format: "uuid",
    description: "Unique identifier for the user",
    examples: ["123e4567-e89b-12d3-a456-426614174000"]
  })
})
export type HeaderBearerType = Static<typeof HeaderBearerSchema>;


export const RoomParamIdSchema = Type.Object({
  roomId: Type.String({
    format: "uuid",
    description: "Unique identifier for the room, formatted as a UUID",
    examples: ["123e4567-e89b-12d3-a456-426614174000"]
  }),
})
export type RoomParamIdType = Static<typeof RoomParamIdSchema>;

export const RoomParamUserIdSchema = Type.Object({
  userId: Type.String({
    format: "uuid",
    description: "Unique identifier for the room, formatted as a UUID",
    examples: ["123e4567-e89b-12d3-a456-426614174000"]
  }),
})
export type RoomParamUserIdType = Static<typeof RoomParamUserIdSchema>;


export const RoomResponseSchema = Type.Object({
  id: Type.String({
    format: "uuid",
    description: "Unique identifier for the room, formatted as a UUID",
    examples: ["123e4567-e89b-12d3-a456-426614174000"]
  })
})

export type RoomResponseType = Static<typeof RoomResponseSchema>;

export const RoomData = Type.Object({
  id: Type.String({
    format: "uuid",
    description: "Unique identifier for the room",
    examples: ["123e4567-e89b-12d3-a456-426614174000"]
  }),
  created_at: Type.String(),
  player_1: Type.String({
    format: "uuid",
    description: "Unique identifier for the player_1",
    examples: ["123e4567-e89b-12d3-a456-426614174000"]
  }),
  player_2: Type.String({
    format: "uuid",
    description: "Unique identifier for the player_2",
    examples: ["123e4567-e89b-12d3-a456-426614174000"]
  }),
  winner: Type.String({
    format: "uuid",
    description: "Unique identifier for the winner",
    examples: ["123e4567-e89b-12d3-a456-426614174000"]
  }),
  score_1: Type.Integer({
    description: "Score of player 1",
    examples: ["4"]
  }),
  score_2: Type.Integer({
    description: "Score of player 2",
    examples: ["2"]
  }),
  type: Type.String({
    description: "Type of the game",
    examples: ["Tournament"]
  }),
})

export type RoomDataType = Static<typeof RoomData>;

export const RoomArray = Type.Object({ rooms: Type.Array(RoomData) });

export type RommArrayType = Static<typeof RoomArray>;

export const RankResponseSchema = Type.Object({
  wins: Type.Integer({
    description: "Number of wins",
    examples: [10]
  }),
  losses: Type.Integer({
    description: "Number of losses",
    examples: [5]
  }),
  total_games: Type.Integer({
    description: "Total number of games played",
    examples: [15]
  }),
  rank: Type.Number({
    description: "Calculated rank based on wins and total games",
    examples: [0.6667]
  })
});
export type RankResponseType = Static<typeof RankResponseSchema>;

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


export const RoomResponseSchema = Type.String({
  format: "uuid",
  description: "Unique identifier for the room, formatted as a UUID",
  examples: ["123e4567-e89b-12d3-a456-426614174000"]
})
export type RoomResponseType = Static<typeof RoomResponseSchema>;


export const RoomQuerySchema = Type.Object({
  privateRoom: Type.Optional(Type.Boolean({
    description: "Indicates if the room is private",
  })),
  userIdInvited: Type.Optional(Type.String({
    format: "uuid",
    description: "Unique identifier for the user invited to the private room",
    examples: ["123e4567-e89b-12d3-a456-426614174000"]
  }))
})
export type RoomQueryType = Static<typeof RoomQuerySchema>;

import { Static, Type } from "@sinclair/typebox";
import { TypeUpload } from "../services/UploadService.js";

export const uploadFilePublic = Type.Object({
  uploadFile: Type.Any()
})

export const UploadFileParams = Type.Object({
  typePath: Type.Enum(TypeUpload, {
    "description": "Type of upload file",
    "default": TypeUpload.avatar
  })
})

export const UploadFileValidation = Type.Object({
  Url: Type.String({format: "uri", description: "The URL of the uploaded file"})
})


export const CdnQuery = Type.Object({
  size: Type.Optional(Type.Number({
    description: "The size of the image to be returned. If not specified, the original size will be used.",
  })),
  scale: Type.Optional(Type.Union([Type.String(), Type.Number()])),
  width: Type.Optional(Type.Number()),
  height: Type.Optional(Type.Number()),
  resizeMode: Type.Optional(Type.Union([
    Type.Literal('contain'),
    Type.Literal('cover'),
    Type.Literal('fill'),
    Type.Literal('inside'),
    Type.Literal('outside'),
  ])),
  blur: Type.Optional(Type.Number()),
  grayscale: Type.Optional(Type.Boolean()),
  greyscale: Type.Optional(Type.Boolean()),
  tint: Type.Optional(Type.String()),
  rotate: Type.Optional(Type.Number()),
})


export type UploadFileParamsType = Static<typeof UploadFileParams>;
export type UploadFileValidationType = Static<typeof UploadFileValidation>;
export type CdnQueryType = Static<typeof CdnQuery>;

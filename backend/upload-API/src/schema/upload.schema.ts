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
  scale: Type.Optional(Type.Union([Type.String(), Type.Number()], {
    description: "The scale factor for the image. Can be a number or a pourcentage string (e.g., '50%'). If not specified, the original size will be used.",
  })),
  width: Type.Optional(Type.Number({
    description: "The width of the image to be returned. If not specified, the original width will be used.",
  })),
  height: Type.Optional(Type.Number({
    description: "The height of the image to be returned. If not specified, the original height will be used.",
  })),
  resizeMode: Type.Optional(Type.Union([
    Type.Literal('contain'),
    Type.Literal('cover'),
    Type.Literal('fill'),
    Type.Literal('inside'),
    Type.Literal('outside'),
  ], {
    description: "The resize mode for the image. Determines how the image should be resized to fit the specified dimensions.",
    default: 'cover',
  })),
  blur: Type.Optional(Type.Number({
    description: "The amount of blur to apply to the image. A value of 0 means no blur, while higher values increase the blur effect.",
    default: 0,
    minimum: 0,
    maximum: 100
  })),
  grayscale: Type.Optional(Type.Boolean({
    description: "Whether to apply a greyscale effect to the image. If true, the image will be converted to greyscale.",
    default: false
  })),
  greyscale: Type.Optional(Type.Boolean({
    description: "Alias for grayscale. Whether to apply a greyscale effect to the image. If true, the image will be converted to greyscale.",
    default: false
  })),
  tint: Type.Optional(Type.String({
    description: "A color to tint the image with. The color should be in RGB format R,G, B (e.g., '255,0,0' for red). If not specified, no tint will be applied.",
  })),
  rotate: Type.Optional(Type.Number({
    description: "The angle in degrees to rotate the image. Positive values rotate clockwise, while negative values rotate counter-clockwise. If not specified, no rotation will be applied.",
    default: 0,
    minimum: -360,
    maximum: 360
  })),
});

export const proxyCDN = Type.Object({
  url: Type.String({
    description: "The URL of the file to be proxied from the CDN. This should be a valid URL pointing to the file you want to retrieve.",
    format: "uri"
  })
});


export type UploadFileParamsType = Static<typeof UploadFileParams>;
export type UploadFileValidationType = Static<typeof UploadFileValidation>;
export type CdnQueryType = Static<typeof CdnQuery>;
export type ProxyCDNType = Static<typeof proxyCDN>;
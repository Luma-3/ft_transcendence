import { UploadService } from "../services/UploadService.js";

export const uploadFilePublic = {
  $id: 'uploadFilePublic',
  type: 'object',
  required: ["uploadFile"],
  properties: {
    uploadFile: {
        type: "object"
    }
  }
}

export const uploadFileParams = {
  $id: 'uploadFileParams',
  type: 'object',
  required: ["typePath"],
  properties: {
    typePath: { type: 'string', enum: UploadService._typeUpload},
  }
}

export const uploadFileValidation = {
  $id: 'uploadFileValidation',
  type: 'object',
  properties: {
    Url: { type: 'string', format: 'uri' },
  }
}

export async function uploadSchema(fastify) {
  fastify.addSchemaFormater(uploadFileParams);
  fastify.addSchemaFormater(uploadFilePublic);
  fastify.addSchemaFormater(uploadFileValidation);
}

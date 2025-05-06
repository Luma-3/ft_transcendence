export { BaseError } from './BaseError.js'
export { NotFoundError } from './NotFoundError.js'
export { BadRequestError } from './BadRequestError.js'
export { ConflictError } from './ConflictError.js'
export { ForbidenError } from './ForbidenError.js'
export { InternalServerError } from './InternalServerError.js'
export { UnauthorizedError } from './UnauthorizedError.js'

import { NotFoundSchema } from './NotFoundError.js'
import { BadRequestSchema } from './BadRequestError.js'
import { ConflictSchema } from './ConflictError.js'
import { ForbiddenSchema } from './ForbidenError.js'
import { InternalServerErrorSchema } from './InternalServerError.js'
import { UnauthorizedSchema } from './UnauthorizedError.js'

export function registerErrorSchema(fastify) {
  fastify.addSchema(NotFoundSchema);
  fastify.addSchema(BadRequestSchema);
  fastify.addSchema(ConflictSchema);
  fastify.addSchema(ForbiddenSchema);
  fastify.addSchema(InternalServerErrorSchema);
  fastify.addSchema(UnauthorizedSchema);
}

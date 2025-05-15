export { BaseError } from './BaseError.js'
export { NotFoundError } from './NotFoundError.js'
export { BadRequestError } from './BadRequestError.js'
export { ConflictError } from './ConflictError.js'
export { ForbiddenError } from './ForbiddenError.js'
export { InternalServerError } from './InternalServerError.js'
export { UnauthorizedError } from './UnauthorizedError.js'
export { ValidationError } from './ValidationError.js'

import { NotFoundSchema } from './NotFoundError.js'
import { BadRequestSchema } from './BadRequestError.js'
import { ConflictSchema } from './ConflictError.js'
import { ForbiddenSchema } from './ForbiddenError.js'
import { InternalServerErrorSchema } from './InternalServerError.js'
import { UnauthorizedSchema } from './UnauthorizedError.js'
import { ValidationSchema } from './ValidationError.js'

export function registerErrorSchema(fastify) {
  fastify.addSchema(NotFoundSchema);
  fastify.addSchema(BadRequestSchema);
  fastify.addSchema(ConflictSchema);
  fastify.addSchema(ForbiddenSchema);
  fastify.addSchema(InternalServerErrorSchema);
  fastify.addSchema(UnauthorizedSchema);
  fastify.addSchema(ValidationSchema);
}

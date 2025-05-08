import { ForbiddenError } from '@transcenduck/error'

export const InternalRoute = async (req) => {
  if (req.url.includes('/internal/')) {
    throw new ForbiddenError();
  }
}

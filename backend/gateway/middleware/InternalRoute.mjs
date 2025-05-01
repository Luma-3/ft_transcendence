
export const InternalRoute = async (req, rep) => {
  if (req.url.includes('/internal/')) {
    return rep.code(403).send({mesaage: 'Forbidden'})
  }
}

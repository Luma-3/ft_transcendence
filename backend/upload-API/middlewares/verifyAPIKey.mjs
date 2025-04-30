export default function verifyAPIKey(allowedKey) {
  return async function (req, rep) {
    const key = req.headers['x-api-key'];

    if (!key || typeof key !== 'string') {
      return rep.code(401).send({message: 'Missing API Key'})
    }

    if (!allowedKey.includes(key)) {
      return rep.code(403).send({message: 'Invalide API Key'})
    }
  }
}


export async function createSession(username, password) {
  const user = await this.userModel.findByUsername(username,)
  if (!user) {
    return rep.code(401).send({ message: "Login or password incorrect" })
  }

  const isMatch = await this.bcrypt.compare(password, user.password);
  if (!isMatch) {
    return rep.code(401).send({ message: "Login or password incorrect" })
  }

  const userPayload = {
    id: user.id,
    username: username,
    email: user.email
  }

  return this.jwt.sign(userPayload, this.jwt.options.sign);
}

export async function removeSession() {
  // TODO : Redis or Sqlite for invalid token 
}

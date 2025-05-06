import { ConflictError } from "@transcenduck/error";

export async function createUser(username, password, email) {
  const existing_user = await this.userModel.findByUsername(username);
  if (existing_user) {
    throw new ConflictError("Username Already Exist");
  }

  const hash_pass = await this.bcrypt.hash(password);
  const user_obj = {
    username: username,
    password: hash_pass,
    email: email,
    lang: 'en',
    pp_url: `https://${process.env.GATEWAY_IP}/uploads/profil_pic/default_pp.webp`,
    theme: 'dark'
  }

  return await this.userModel.insert(user_obj);
}

export async function deleteUser(username) {
  // TODO : Delete user and all of they ressources
}

export async function getUserbyID(id, schema) {
  const [user] = this.userModel.findByID(id, schema);
  return user;
}

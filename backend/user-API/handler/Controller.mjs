import { publicUserSchema, privateUserSchema } from "./Schema.mjs";


export async function login(req, rep) {
	const {username, password} = req.body;

	if (!username || !password) {
		return rep.code(400).send({message: "Username and password are required"})
	}

	const user = await this.userModel.findByUsername(username, ['id', 'username', 'password']);
	if (!user) {
		return rep.code(401).send({message: "Login or password incorrect"})
	}

	const isMatch = await this.bcrypt.compare(password, user.password);
	if (!isMatch) {
		return rep.code(401).send({message: "Login or password incorrect"})
	}

	const token = this.jwt.sign(user, this.jwt.options.sign);

	return rep.code(200).setCookie("token", token, {
		httpOnly: true,
		secure: process.env.COOKIE_SECURE,
		sameSite: process.env.NODE_ENV === "production" ? "none": undefined,
		path: "/",
		maxAge: 60 * 60 * 24, // 1 jour
	}).send({});
}


export async function register(req, rep) {
	const {username, password, email} = req.body;

	if (!username || !password) {
		return rep.code(400).send({message: "Username and password are required"})
	}

	const existingUser = await this.userModel.findByUsername(username);
	if (existingUser) {
		return rep.code(403).send({message: 'User Already Exist'})
	}

	let hash_pass = await this.bcrypt.hash(password);
	const obj_user = {
		username: username,
		password: hash_pass,
		email: email,
    land: 'en',
    pp_url: 'https://localhost:3000/uploads/profil_pic/default_pp.webp', // TODO : prod env handle
    theme: 'dark',
	}

	const [newUser] = await this.userModel.insert(obj_user);
	console.log(newUser);

	const token = this.jwt.sign(newUser, this.jwt.options.sign);
	
	return rep.code(201).setCookie("token", token, {
		httpOnly: true,
		secure: process.env.COOKIE_SECURE,
		sameSite: process.env.NODE_ENV === "production" ? "none": "none",
		path: "/",
		maxAge: 60 * 60 * 24, // 1 jour
	}).send({});
}

export async function oauthCallback(req, rep) {
	const {token} = await this.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(req)

	const res = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
		headers: {
			Authorization: `Bearer ${token.access_token}`
		}
	});
	const profile = await res.json();
	const user =	await this.userModel.findByUsername(profile.given_name)

	const cookieOpt = {
		httpOnly: true,
		secure: process.env.COOKIE_SECURE,
		sameSite: process.env.NODE_ENV === "production" ? "none": undefined,
		path: "/",
		maxAge: 60 * 60 * 24, // 1 jour
	}

	if (user) {
		const jwtToken = this.jwt.sign(user, this.jwt.options.sign);
		return rep.setCookie('token', jwtToken, cookieOpt).redirect('http://localhost:5173/dashboard');
	}

	const [newUser] = await this.userModel.insert({
		username: profile.given_name,
	})
	const jwtToken = this.jwt.sign(newUser, this.jwt.options.sign);

	return rep.setCookie('token', jwtToken, cookieOpt).redirect('http://localhost:5173/dashboard');
}


export async function getUser(req, rep) {
	const { userId } = req.params;

	const [db_user] = await this.userModel.findByID(userId, Object.keys(publicUserSchema.properties));

	if (!db_user) {
		return rep.code(404).send({message: "user ID not found"});
	}
	return rep.code(200).send({data: db_user});
}

export async function privateInfoUser(req, rep) {
	const id = req.headers['x-user-id'];

	const [userInfo] = await this.userModel.findByID(id, Object.keys(privateUserSchema.properties));

	return rep.code(200).send({data : userInfo, message: 'Ok'});
}

export async function logout(req, rep) {
	return rep.clearCookie('token', {
		path: '/'
	}).code(200).send({message: 'logged out successfully'})
}

export async function dev_login(req, rep) {
  const jwt = this.jwt.sign({username: "admin"});
  console.log(jwt);
  return rep.send(jwt);
}

export async function changePreferances(req, rep) {
  const body = req.body;
  const id = req.headers['x-user-id'];

  const [userInfo] =  this.userModel.update(id, body, Object.keys(privateUserSchema.properties));
  return rep.code(200).send({data : userInfo, message: 'Updated'});
}

export async function changeProfilePic(req, rep) {
  const id = req.headers['x-user-id'];

  const [pp_url] = await this.userModel.findByID(id, ['pp_url']);

  if (pp_url !== 'https://localhost:3000/uploads/profil_pic/default_pp.webp') {
    const response = await fetch(`https://localhost:3002/uploads/profil_pic/${pp_url}`, {
      method: 'DELETE',
      headers: {
        'x-api-key': `${process.env.UPLOAD_API_KEY}`
      }
    })

    if (!response.ok) {
      return rep.code(500).send({message: 'Upload-Service Error'});
    }
  }

  const response = await fetch('https://localhost:3002/upload/uplaodFile/', {
    method: 'POST',
    body: req.body
  })
  if (!response.ok) {
    return rep.code(500).send({message: 'Upload-Service Error'});
  }

  const json = response.json();
  const [userInfo] = await this.userModel.update(id, {pp_url: json.url});
  return rep.code(201).send({message: "profile picture changed", data: {pp_url: userInfo.pp_url}});
}

export async function changePassword(req, rep) {
  const { oldPassword, newPassword } = req.body;
  const id = req.headers['x-user-id'];

  const [user] = await this.userModel.findByID(id, ['password']);
  let isMatch = await this.bcrypt.compare(oldPassword, user.password);

  if (!isMatch) {
    return rep.code(401).send({message: 'Old password incorrect'});
  }

  if (oldPassword === newPassword) {
    return rep.code(401).send({message: 'newPassword is too `similar'});
  }

  const hash_pass = this.bcrypt.hash(newPassword);
  this.userModel.update(id, {password: newPassword});
  return rep.code(204);
}

export async function changeEmail(req, rep) {
  const { email } = req.body;
  const id = req.headers['x-user-id'];

  this.userModel.update(id, {email: email});
  return rep.code(204);
}


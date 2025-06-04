export async function addFriend(req, res) {
	const userId = req.headers['x-user-id'];
	const { friendId } = req.params;
	await this.friendsServices.addFriend(userId, friendId);
	return res.status(200).send({ status: "success", message: "Friend added successfully" });
}

export async function removeFriend(req, res) {
	const userId = req.headers['x-user-id'];
	const { friendId } = req.params;
	await this.friendsServices.removeFriend(userId, friendId);
	return res.status(200).send({ status: "success", message: "Friend removed successfully" });
}

export async function refuseFriend(req, res) {
	const userId = req.headers['x-user-id'];
	const { friendId } = req.params;
	await this.friendsServices.refuseFriend(userId, friendId);
	return res.status(200).send({ status: "success", message: "Friend request refused successfully" });
}
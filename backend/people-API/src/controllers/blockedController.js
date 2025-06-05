export async function blockUser(req, res) {
	const userId = req.headers['x-user-id'];
	const { blockedId } = req.params;
	try {
		await this.blockedServices.blockUser(userId, blockedId);
		res.status(200).send({ message: "User blocked successfully" });
	} catch (error) {
		console.error("Error blocking user:", error);
		res.status(400).send({ error: error.message });
	}
}

export async function unBlockUser(req, res) {
	const userId = req.headers['x-user-id'];
	const { blockedId } = req.params;
	try {
		await this.blockedServices.unBlockUser(userId, blockedId);
		res.status(200).send({ message: "User unblocked successfully" });
	} catch (error) {
		res.status(400).send({ error: error.message });
	}
}
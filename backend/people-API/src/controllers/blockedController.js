export async function blockUser(req, res) {
	const userId = req.headers['x-user-id'];
	const { blockedId } = req.params;
	try {
		await this.blockedServices.blockUser(userId, blockedId);
		res.status(200).json({ message: "User blocked successfully" });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
}

export async function unBlockUser(req, res) {
	const userId = req.headers['x-user-id'];
	const { blockedId } = req.params;
	try {
		await this.blockedServices.unBlockUser(userId, blockedId);
		res.status(200).json({ message: "User unblocked successfully" });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
}
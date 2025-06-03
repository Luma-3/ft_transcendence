
export async function getAll(req, res) {
	return res.status(200).send({ status: "success", data : await this.peopleServices.getAll() });
}

export async function search(req, res) {
	console.log("Search query:", req.query);
	const { search } = req.query;
	if (!search) {
		return res.status(400).send({ status: "error", message: "Search query is required" });
	}
	
	return res.status(200).send({ status: "success", data: await this.peopleServices.search(search) });
}

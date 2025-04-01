
export default function formatJSON(request, reply, payload) {
	if (payload && typeof(payload) === 'object' && "status" in payload) {
		return payload;
	}

	if (reply.statusCode >= 400) {
		return {
			status: "error",
			message: payload?.message || "",
			details: payload?.details || {},
		};
	}

	return {
		status: "success",
		message: payload?.message || "Ok",
		data: payload?.data || {},
	};
};
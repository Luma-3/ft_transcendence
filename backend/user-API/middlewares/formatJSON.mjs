
export default async function formatJSON(request, reply, payload) {
	if (payload == null) {
		return {
			status: 'error',
			message: '',
			details: {},
		}
	}

	if (payload && typeof(payload) === 'object' && 'swagger' in payload) {
		return payload;
	}

	if (payload && typeof(payload) === 'object' && 'status' in payload) {
		return payload;
	}

	if (reply.statusCode >= 400) {
		return {
			status: 'error',
			message: payload?.message || '',
			details: payload?.details || {},
		};
	}

	return {
		status: 'success',
		message: payload?.message || 'Ok',
		data: payload?.data || {},
	};
};
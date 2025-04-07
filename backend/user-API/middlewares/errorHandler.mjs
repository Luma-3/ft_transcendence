export default function errorHandler(error, request, reply) {

	if (error.validation) {
		return reply.status(400).send({
			status: 'error',
			status: 400,
			message: "Validation Error",
			details: error.validation
		});
	}

	if (error.code === 'SQLITE_CONSTRAINT') {
		return reply.status(error.statusCode || 500).send({
			status: 'error',
			message: error.message || "Internal Server Error",
			details: {
				code: error.code,
				errno: error.errno
			}
		});
	}

	return reply.status(error.statusCode || 500).send({
		status: 'error',
		message: error.message || "Internal Server Error",
		details: error.cause
	});
}
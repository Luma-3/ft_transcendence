
export function PageNotFound() {
	createError("Page Not Found");
}

export function createError(message, details = {}) {
	return {
		status: "error",
		message: message,
		details: details
	}
}

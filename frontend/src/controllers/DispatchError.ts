import notFoundPage from "../pages/4xx";
import errorPage from "../pages/5xx";
import { renderPublicPage } from "./renderPage";

const knownErrors = new Map<string, string>([
	['400', 'Bad Request'],
	['401', 'Unauthorized'],
	['402', 'Payment Required'],
	['403', 'Forbidden'],
	['404', 'Not Found'],
	['405', 'Method Not Allowed'],
	['409', 'Conflict'],
	['410', 'Gone'],
	['413', 'Payload Too Large'],
	['415', 'Unsupported Media Type'],
	['500', 'Internal Server Error'],
]);


export function dispatchError(code: string, messageServer: string) {
	switch (code) {
		case '404':
			return notFoundPage();
		// case '401':
		// 	return window.location.href = '/login';
		default:
			return errorPage(code, knownErrors.get(code) || "Unknown error", messageServer);
	}
}
import notFoundPage from "../pages/4xx";
import errorPage from "../pages/5xx";

const knownErrors = new Map<string, string>([
	['400', 'bad-request'],
	['401', 'unauthorized'],
	['402', 'payment-required'],
	['403', 'forbidden'],
	['404', 'not-found'],
	['405', 'method-not-allowed'],
	['409', 'conflict'],
	['410', 'gone'],
	['413', 'payload-too-large'],
	['415', 'unsupported-media-type'],
	['500', 'internal-server-error'],
]);


export function dispatchError(code: string) {
	switch (code) {
		case '404':
			return notFoundPage();
		case '401':
			return window.location.href = '/login';
		default: 
			return errorPage(code, knownErrors.get(code) || "Unknown error");
	}
}
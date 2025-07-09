import { fetchApiWithNoError } from "../../api/fetch";
import { MODULE_TWOFA } from "../../api/routes";
import { alertTemporary } from "../../components/ui/alert/alertTemporary";
import { renderPublicPage } from "../../controllers/renderPage";

export async function verifyEmailUser(token: string) {
	alertTemporary("info", "Verifying your email...", "dark");

	const response = await fetchApiWithNoError(MODULE_TWOFA.VERIFY.EMAIL + `/${token}`, {
		method: "GET",
	});
	if (response.status === "error") {
		await alertTemporary("error", "Error with email verification", "dark");
		// renderPublicPage('register');
		return;
	}

	await alertTemporary("success", "Email verified successfully", "dark");
	// window.location.href = "/login";
}

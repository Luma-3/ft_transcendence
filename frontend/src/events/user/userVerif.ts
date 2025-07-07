import { fetchApiWithNoError } from "../../api/fetch";
import { MODULE_TWOFA } from "../../api/routes";
import { alertTemporary } from "../../components/ui/alert/alertTemporary";
import { renderPrivatePage } from "../../controllers/renderPage";

export async function verifyEmailUser(token: string) {
	const response = await fetchApiWithNoError(MODULE_TWOFA.VERIFY.EMAIL + `/${token}`, {
		method: "GET",
	});
	if (response.status === "error") {
		alertTemporary("error", "Error with email verification", "dark");
		renderPrivatePage('dashboard');
	}
	
	alertTemporary("success", "Email verified successfully", "dark");
	renderPrivatePage('dashboard')
}
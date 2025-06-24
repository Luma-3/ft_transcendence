import { fetchApi, fetchApiWithNoError } from "../../api/fetch";
import { API_USER } from "../../api/routes";
import { alertTemporary } from "../../components/ui/alert/alertTemporary";
import { renderPrivatePage, renderPublicPage } from "../../controllers/renderPage";

export async function verifyEmailUser(token: string) {
	const response = await fetchApiWithNoError(API_USER.VERIFY.EMAIL + `/${token}`, {
		method: "GET",
	});
	if (response.status === "error") {
		alertTemporary("error", "Error with email verification", "dark");
		return window.location.href = "/404";
	}
	
	alertTemporary("success", "Email verified successfully", "dark");
	renderPublicPage('login')
}

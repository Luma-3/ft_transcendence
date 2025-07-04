import { fetchApiWithNoError } from "../../api/fetch";
import { MODULE_TWOFA } from "../../api/routes";
import { alertTemporary } from "../../components/ui/alert/alertTemporary";

export async function verifyEmailUser(token: string) {
	alertTemporary("info", "Verifying your email...", "dark");
	const response = await fetchApiWithNoError(MODULE_TWOFA.VERIFY.EMAIL + `/${token}`, {
		method: "GET",
	});
	if (response.status === "error") {
		alertTemporary("error", "Error with email verification", "dark");
		return window.location.href = "/404";
	}
	
	alertTemporary("success", "Email verified successfully", "dark");
	return window.location.href = "/login";
}

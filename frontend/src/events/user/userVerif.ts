import { fetchApiWithNoError } from "../../api/fetch";
import { MODULE_TWOFA } from "../../api/routes";
import { alertPublic } from "../../components/ui/alert/alertPublic";

export async function verifyEmailUser(token: string) {

	const response = await fetchApiWithNoError(TWOFA.EMAIL + `/${token}`, {
		method: "GET",
	});
	//TODO: Traduction
	if (response.status === "error") {
		await alertPublic("cannot-verify-email-too-old-mail-or-retry-registration-process", "error");
		window.location.href = "/register";
		return;
	}
	await alertPublic("email-verified-successfully", "success");
	window.location.href = "/login";
}

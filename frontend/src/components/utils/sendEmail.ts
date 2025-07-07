import { fetchApi, fetchApiWithNoError } from "../../api/fetch";
import { MODULE_TWOFA } from "../../api/routes";

import { userEmail, userLang } from "../../events/user/userRegister";
import { alertTemporary } from "../ui/alert/alertTemporary";

export async function sendEmail() {
	const response = await fetchApiWithNoError(MODULE_TWOFA.RESEND_EMAIL, {
		method: 'POST',
		body: JSON.stringify({ email: userEmail, lang: userLang ?? 'en' })
	})

	if (response.status === "error") {
		alertTemporary("error", "Email already sent", "dark");
		console.log(response.details);
	}

	alertTemporary("success", "Email sent succefully", "dark");
}

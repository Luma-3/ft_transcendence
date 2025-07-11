import { alert } from "../../components/ui/alert/alert";

import { API_SESSION } from "../../api/routes";
import { fetchApiWithNoError } from "../../api/fetch";
import { alertTemporary } from "../../components/ui/alert/alertTemporary";

export async function logOutUser() {

	const confirmResponse = await alert("are-you-sure", "warning");
	if (confirmResponse) {
		const responseApi = await fetchApiWithNoError(API_SESSION.DELETE, {
			method: 'DELETE',
			headers: {
				"Content-Type": "text/plain",
				credentials: 'include',
			},
			body: "",
		});
		//TODO: Traduction
		if (responseApi.status === "error") {
			return alertTemporary("error-clean-your-cookies", "error", 'dark', false, true);
		}
		window.location.href = "/";
	} 
}
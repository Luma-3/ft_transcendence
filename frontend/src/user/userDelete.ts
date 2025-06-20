import { alert } from "../components/ui/alert/alert";

import { API_USER } from "../api/routes";
import { fetchApi, fetchApiWithNoBody } from "../api/fetch";

export async function deleteUser() {

	const confirmResponse = await alert("are-you-sure", "warning");
	
	if (confirmResponse) {
		const response = await fetchApi(API_USER.BASIC.DELETE, {
			method: 'DELETE',
			headers: {
				"Content-Type": "text/plain",
			}
		});

		if (response.status === "error") {
			return alert("cannot-delete-user", "error");
		}
		window.location.href = '/';
	}
}
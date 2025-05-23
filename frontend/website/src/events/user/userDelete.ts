import { alert } from "../../components/ui/alert/alert";

import { API_USER } from "../../api/routes";
import { fetchApiWithNoBody } from "../../api/fetch";

export async function deleteUser() {

	const confirmResponse = await alert("are-you-sure", "warning");
	
	if (confirmResponse) {
		const response = await fetchApiWithNoBody(API_USER.BASIC.DELETE, {
			method: 'DELETE'});
		
			if (response.status === "error") {
				return alert("cannot-delete-user", "error");
			}
		window.location.href = '/';
	}
}
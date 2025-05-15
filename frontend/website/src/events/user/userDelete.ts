import { API_USER } from "../../api/routes";
import { fetchApiWithNoBody } from "../../api/fetch";
import { alert } from "../../components/ui/alert/alert";

export async function deleteUser() {

	const confirmResponse = await alert("are-you-sure", "warning");
		if (confirmResponse) {
		const response = await fetchApiWithNoBody(API_USER.BASIC.DELETE, {
			method: 'DELETE',
		});
		if (response.status === "error") {
			alert("cannot_delete_user", "error");
			return;
		}
		window.location.href = '/';
	}
}
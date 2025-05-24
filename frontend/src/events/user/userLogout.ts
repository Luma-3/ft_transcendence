import { alert } from "../../components/ui/alert/alert";

import { API_SESSION } from "../../api/routes";
import { fetchApiWithNoBody } from "../../api/fetch";

export async function logOutUser() {

	const confirmResponse = await alert("are-you-sure", "warning");
	if (confirmResponse) {
		
		const responseApi = await fetchApiWithNoBody(API_SESSION.DELETE, {
			method: 'DELETE',
			body: JSON.stringify({}),
		});
		if (responseApi.status === "error") {
			return alert(responseApi.message, "error");
		
		}
		sessionStorage.removeItem("backPage");
		window.location.href = "/";
	} 
}
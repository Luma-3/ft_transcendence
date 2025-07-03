import { alert } from "../../components/ui/alert/alert";

import { API_SESSION } from "../../api/routes";
import { fetchApiWithNoError } from "../../api/fetch";

export async function logOutUser() {

	const confirmResponse = await alert("are-you-sure", "warning");
	if (confirmResponse) {
		console.log("User confirmed logout");
			const responseApi = await fetchApiWithNoError(API_SESSION.DELETE, {
				method: 'DELETE',
				headers: {
					"Content-Type": "text/plain",
					credentials: 'include',
				},
				body: "",
			});
			if (responseApi.status === "error") {
				return alert(responseApi.message, "error");
			
			}
			window.location.href = "/";
	} 
}
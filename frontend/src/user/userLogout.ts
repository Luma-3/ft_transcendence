import { alert } from "../components/ui/alert/alert";

import { API_SESSION } from "../api/routes";
import { fetchApi } from "../api/fetch";

export async function logOutUser() {

	const confirmResponse = await alert("are-you-sure", "warning");
	if (confirmResponse) {
			const responseApi = await fetchApi(API_SESSION.DELETE, {
				method: 'DELETE',
				headers: {
					"Content-Type": "text/plain",
				},
				body: JSON.stringify({}),
			});
			if (responseApi.status === "error") {
				return alert(responseApi.message, "error");
			
			}
			sessionStorage.removeItem("backPage");
			window.location.href = "/";
	} 
}
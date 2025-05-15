import { API_SESSION } from "../../api/routes";
import { fetchApi, fetchApiWithNoBody } from "../../api/fetch";
import { alert } from "../../components/ui/alert/alert";

export async function logOutUser() {
	const confirmResponse = await alert("are-you-sure", "warning");
	if (confirmResponse) {
		
		const responseApi = await fetchApiWithNoBody(API_SESSION.DELETE, {
			method: 'DELETE',
			body: JSON.stringify({}),
		});
		if (responseApi.status === "success") {
			sessionStorage.removeItem("backPage");
			window.location.href = "/";
			return;
		}
		alert(responseApi.message, "error");
	} 
	return;
}
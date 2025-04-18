import { API_ROUTES } from "../../api/routes";
import { fetchApi } from "../../api/fetch";
import { alert } from "../../components/ui/alert";
import { renderPage } from "../../renderers/renderPage";
import { User } from "../../api/interfaces/User";

export async function logOutUser() {
	const confirmResponse = await alert("are-you-sure", "warning");
	if (confirmResponse) {
		
		const responseApi = await fetchApi<User>(API_ROUTES.USERS.LOGOUT, {method: "GET", credentials: "include"})
		
		if (responseApi.status == "success") {
			renderPage('home');
			return;
		}
		alert(responseApi.message, "error");
	} 
	return;
}
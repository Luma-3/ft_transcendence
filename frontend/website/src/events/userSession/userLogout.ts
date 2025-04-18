import { API_ROUTES } from "../../api/routes";
import { fetchApi } from "../../api/fetch";
import { alertErrorWithVerif } from "../../components/ui/alertErrorWithVerif";
import { renderPage } from "../../renderers/renderPage";
import { User } from "../../api/interfaces/User";

export async function logOutUser() {
	alertErrorWithVerif("are-you-sure").then((result) => {
		if (result == true) {
			fetchApi<User>(API_ROUTES.USERS.LOGOUT, {method: "GET", credentials: "include"})
				.then((response) => {
					if (response.status == "success") {
						renderPage('home');
					} else {
						renderPage('settings');
					}
		})
		.catch((error) => {
			console.error("Logout failed:", error);
		});
	}});
}
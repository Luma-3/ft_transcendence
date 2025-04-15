import { API_ROUTES } from "../../api/routes";
import { fetchApi } from "../../api/fetch";
import { alertErrorWithVerif } from "../../components/ui/alertErrorWithVerif";
import { renderPage } from "../../renderers/renderPage";

export function logOutUser() {
	alertErrorWithVerif("are-you-sure").then((result) => {
		if (result == true) {
		}
		else {
			renderPage('settings');
		}
	});
			

}
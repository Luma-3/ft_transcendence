import { renderPrivatePage } from '../../components/renderPage'
import { fetchWithNoToken } from '../../api/fetch';
import { User } from '../../api/interfaces/User';
import { API_SESSION } from '../../api/routes';
import { alertPublic } from '../../components/ui/alert/alertPublic';

export async function loginUser() {

	const form = document.forms.namedItem("LoginForm") as HTMLFormElement | null;
	if (!form) {
		return;
	}

	const formData = new FormData(form);
	const userdata = Object.fromEntries(formData) as Record<string, string>;

	if (userdata.username === "" || userdata.password === "") {
		return;
	}

	const response = await fetchWithNoToken<User>(API_SESSION.CREATE,
			{method: "POST", body: JSON.stringify(userdata)})
	
	if (response.status === "error") {
		alertPublic("username_or_password_incorrect", "error");
		return;
	}
	renderPrivatePage('reWelcomeYou');
	setTimeout(() => {
		renderPrivatePage('dashboard',true);
	}, 1200);
}
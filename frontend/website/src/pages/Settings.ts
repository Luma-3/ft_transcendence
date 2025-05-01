import { changeDefaultLang } from "../components/ui/changeDefaultLang";
import { navbar } from "../components/ui/navbar";
import { User } from "../api/interfaces/User";
import { fetchApi } from "../api/fetch";
import { API_ROUTES } from "../api/routes";
import { changeLanguage } from "../i18n/Translate";
import { change2FA } from "../components/ui/change2FA";
import { footer } from "../components/ui/footer";
import { primaryButton } from "../components/ui/primaryButton";
import { headerPage } from "../components/ui/headerPage";
(window as any).changeLanguage = changeLanguage;
import notfound from "./404";



async function renderSettingsPage() {

const userinfoResponse = await fetchApi<User>(API_ROUTES.USERS.INFOS,
	{method: "GET", credentials: "include"});

	if (userinfoResponse.status === "success" && userinfoResponse.data) {
		
		const userInfos = userinfoResponse.data;
		
		return `
			${navbar(userInfos)}
			${headerPage("settings")}
				<div class="flex flex-col items-center ml-15 mr-15 justify-center space-y-4 space-x-4 pt-10
				text-secondary dark:text-dtertiary">
					${changeDefaultLang()}
					<br>
					${change2FA()}
					<br>
					<div class="flex flex-col w-full font-title border-red-600 border-2 space-y-2 p-2 justify-center items-center rounded-lg">
						<span class=""> Dangerous Actions </span>
						${primaryButton({id: 'deleteAccount', weight: "1/3", text: 'Delete account', translate: 'delete-account', type: 'button'})}
					</div>
				</div>
				<div class="flex flex-col items-center justify-center space-y-4 pt-20">
					${primaryButton({id: "logout", text: "logout",weight:"1/2", translate: "logout"})}
				</div>
			</div>
			${footer()}`
	}
	return notfound()
}

export default function settingsPage() {
	return renderSettingsPage();
}

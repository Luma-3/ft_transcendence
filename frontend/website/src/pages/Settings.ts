import { changeDefaultLang } from "../components/ui/selectDefaultLang";
import { navbar } from "../components/ui/navbar";
import { changeLanguage } from "../i18n/Translate";
import { change2FA } from "../components/ui/buttons/change2FAButton";
import { footer } from "../components/ui/footer";
import { primaryButton } from "../components/ui/buttons/primaryButton";
import { headerPage } from "../components/ui/headerPage";
(window as any).changeLanguage = changeLanguage;
import notfound from "./4xx";
import { getUserInfo } from "../api/getter";
import { animateButton } from "../components/ui/buttons/animateButton";



async function renderSettingsPage() {

const userinfoResponse = await getUserInfo();

	if (userinfoResponse.status === "success" && userinfoResponse.data) {
		
		const userInfos = userinfoResponse.data;
		
		return `
			${navbar(userInfos)}
			${headerPage("settings")}
				<div class="flex flex-col items-center ml-15 mr-15 justify-center space-y-4 space-x-4 pt-10
				text-tertiary dark:text-dtertiary">
					${changeDefaultLang(userInfos.preferences.lang)}
					<br>
					${change2FA()}
					<br>
					<div class="flex flex-col w-full max-w-[800px] font-title border-red-600 border-2 space-y-2 p-2 justify-center items-center rounded-lg">
						<span class="title-responsive-size"> Dangerous Actions </span>
						${primaryButton({id: 'deleteAccount', weight: "1/3", text: 'Delete account', translate: 'delete-account', type: 'button'})}
					</div>
				</div>
				<div class="flex flex-col items-center justify-center space-y-4 pt-20">
				${animateButton("logout", "logout", "😥")}
				</div>
			</div>
			${footer()}`
	}
	return notfound()
}

export default function settingsPage() {
	return renderSettingsPage();
}

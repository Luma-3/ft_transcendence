import { navbar } from "../components/ui/navbar";

import { animateButton } from "../components/ui/buttons/animateButton";
import { primaryButton } from "../components/ui/buttons/primaryButton";

import { languageSelectorSettings } from "../components/ui/languageSelector";
import { change2FA } from "../2FA";
import { headerPage } from "../components/ui/headerPage";
import { IUserInfo } from "../interfaces/IUser";

async function renderSettingsPage(user: IUserInfo) {
return `
${navbar(user)}
${headerPage("settings")}

<div class="flex flex-col items-center justify-center space-y-4 space-x-4 pt-10 text-tertiary dark:text-dtertiary">
	
	${languageSelectorSettings(user.preferences!.lang)}
	<br>
	${await change2FA()}
	<br>
	
	<div class="flex flex-col w-full max-w-[800px] font-title border-red-600 border-2 space-y-2 p-2 justify-center items-center rounded-lg">
		
		<span class="title-responsive-size" translate="dangerous-action"> Dangerous Actions 
		</span>
		
		${primaryButton({id: 'deleteAccount', weight: "1/3", text: 'Delete account', translate: 'delete-account', type: 'button'})}
	
	</div>
	
	<div class="flex flex-col items-center justify-center space-y-4 pt-20 pb-20">
	
	${animateButton("logout", "logout", "`<img src='/images/duckSad.png' class='w-20 h-2- mr-2' alt='Duck sad icon'>`")}
	
	</div>
</div>`
}

export default function settingsPage(user: IUserInfo) {
	return renderSettingsPage(user);
}

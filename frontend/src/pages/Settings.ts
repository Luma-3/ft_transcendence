import { navbar } from "../components/ui/navbar";

import { animateButton } from "../components/ui/buttons/animateButton";

import { languageSelectorSettings } from "../components/ui/languageSelectors";
import { change2FA } from "../2FA";
import { headerPage } from "../components/ui/headerPage";
import { IUserInfo } from "../interfaces/IUser";
import { Button } from "../classes/Button";

async function renderSettingsPage(user: IUserInfo) {

	const deleteAccount = new Button("deleteAccount", "1/3", "Delete account", "delete-account", "primary", "button");

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
		
		${deleteAccount.primaryButton()}
	
	</div>
	
	<div class="flex flex-col items-center justify-center space-y-4 pt-20 pb-20">
	
	${animateButton("logout", "logout", "`<img src='/images/duckSad.png' class='w-20 h-2- mr-2' alt='Duck sad icon'>`")}
	
	</div>
</div>`
}

export default function settingsPage(user: IUserInfo) {
	return renderSettingsPage(user);
}

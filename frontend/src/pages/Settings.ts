import { navbar } from "../components/ui/navbar";

import { animateButton } from "../components/ui/buttons/animateButton";

import { languageSelectorSettings } from "../components/ui/languageSelectors";
import { headerPage } from "../components/ui/headerPage";
import { IUserInfo } from "../interfaces/IUser";
import { Button } from "../classes/Button";
import { FetchInterface } from "../api/FetchInterface";


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


export async function change2FA() {

	let id = 'enable2fa';
	let translate = 'enable-2fa';

	if (await FetchInterface.verify2FA()) {
		id = 'disable2fa';
		translate = 'disable-2fa';
	}
	const activate_button = new Button(id, "1/4", translate, translate, "primary", "button");
	let container = `
	<div class="grid sm:grid-cols-2 gap-4 items-center">
		
		<div class="title-responsive-size font-title justify-center" translate="2fa-auth">

			2FA Authentication

		</div>

		${activate_button.primaryButton()}

	</div>`

	if (id === 'enable2fa') {
		container += `
		<div class="flex flex-col p-2 max-w-[800px] justify-center items-center w-full text-responsive-size font-title" translate="2fa-warning">
			
			Warning !
			No 2FA reduces security
			(as anyone can access your account)<br> and increases the
			risk of accidental actions.<br> This is not recommended !

		</div>`
	}
	return container;
}
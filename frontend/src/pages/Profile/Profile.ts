import { navbar } from "../../components/ui/navbar"
import { backButton } from "../../components/ui/buttons/backButton";

import { IUserInfo } from "../../interfaces/IUser"
import { profileHeader } from "./header";
import { Button } from "../../classes/Button";
import { InputField } from "../../classes/Input";
import { Form } from "../../classes/Form";

import { FetchInterface } from "../../api/FetchInterface";
import { loadTranslation } from "../../controllers/Translate";
import { alertTemporary } from "../../components/ui/alert/alertTemporary";
import { alertChangePassword } from "../../components/ui/alert/alertChangePassword";
	
let formInstance: Form | null;

async function renderProfilePage(user: IUserInfo) {
	const inputs = [
			new InputField(
				"username",
				"text",
				"username",
				"off",
				true,
				"username",
				user.username
			),
			new InputField(
				"email",
				"email",
				"email",
				"off",
				true,
				"email",
				user.email
			)
		]
	
		const buttons = [
			new Button(
				"changeUserInfo",
				"1/2",
				"Save changes",
				"save-changes",
				"primary",
				"submit"
			),
			new Button(
				"change-password",
				"1/2",
				"Change password",
				"change-password",
				"secondary",
				"button",
			)
		]
		formInstance = new Form("updateInfosUserForm", inputs, buttons );

	const saveImage = new Button("save-image", "1/2", "Save", "change-image", "primary", "button");
	const cancelImage = new Button("cancel-image", "1/2", "Cancel", "cancel", "secondary", "button");
	
return `
${navbar(user)}
${backButton()}
<div id="divImage" class="flex flex-col font-title w-full justify-center items-center text-tertiary dark:text-dtertiary space-y-2 ">
	
	${profileHeader({ avatar: user.preferences!.avatar, banner: user.preferences!.banner || 'default.webp' })}

	<div id="hidden-main-image-editor" class="w-full max-w-[1000px] hidden transition-all duration-500 transform translate-y-10 opacity-0 pointer-events-none mt-4 justify-center items-center space-x-2 space-y-4">

		<div class="flex flex-row justify-center items-center gap-2 mt-4 px-50">

			${saveImage.primaryButton()}
			${cancelImage.secondaryButton()}

		</div>

		<div class="flex flex-col justify-center items-center w-full h-[648px] rounded-lg">
	
			<div id="tui-image-editor-container" class="rounded-xl">
			</div>
		
		</div>
		
	</div>

	<div id="updateForm" class="flex flex-col w-full items-center justify-center pt-5">

		${formInstance.toHtml()}

	</div>

</div>

<div class="flex flex-col justify-center items-center">

	<div class="flex h-[100px]">
	</div>

</div>`
}

export default function profilePage(user: IUserInfo) {
	const container = renderProfilePage(user);
	return container;
}

export async function changeUserPassword() {
	await alertChangePassword();
	return ;
}

export async function changeUserNameEmail() {
	const user = await FetchInterface.getUserInfo();
	if (user === undefined) {
		window.location.href = '/login';
		return;
	}

	const trad = await loadTranslation(user.preferences.lang);
	
	const values = formInstance?.getValues("updateInfosUserForm");
	if(!values) { return; }
	
	/**
	 * Verifie si il n'y a pas de changement
	 */
	if (user.username === values.username && user.email === values.email) {
		return alertTemporary("info", trad["no-changes-detected"], user.preferences.theme);
	}

	/**
	 * Changement du username si il est different de l'ancien
	 */
	if (values.username !== user.username) {
		const success = await FetchInterface.updateUsername(values.username);
		if (!success) {
			return alertTemporary("error", trad["username-already-in-use"], user.preferences.theme);
		}
	}

	/**
	 * Changement de l'email si il est different de l'ancien
	 */
	if (values.email !== user.email) {
		const success = await FetchInterface.updateEmail(values.email);
		if (!success) {
			return alertTemporary("error", trad["email-already-in-use"], user.preferences.theme);
		}
	}

	alertTemporary("success", trad["user-info-updated"], user.preferences.theme);
}

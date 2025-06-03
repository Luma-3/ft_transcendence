import notfound from "./4xx";

import { navbar } from "../components/ui/navbar"
import { footer } from "../components/ui/footer"
import { form } from "../components/ui/form/form"

import { primaryButton } from "../components/ui/buttons/primaryButton"
import { secondaryButton } from "../components/ui/buttons/secondaryButton"
import { backButton } from "../components/ui/buttons/backButton";

import { User } from "../api/interfaces/User"
import { getUserInfo } from "../api/getter"
import { API_CDN } from "../api/routes";

function avatarBanner(userPref: {avatar: string, banner: string}) {
	return `
	<div class="flex flex-col mb-20 items-center justify-center space-y-2 pt-4">
	<div id="banner-div" class="relative w-[1000px] h-64 editor-select ">
		
		<!-- ! BANNER  -->
		<div class="relative w-full h-full group" >
			<label for="banner-upload">
			<input id="banner-upload" type="" accept="image/*" class="hidden " data-type="banner" />  
					<img src="${API_CDN.BANNER}/${userPref.banner ?? 'default.webp'}" alt="Banner" 
					class="w-full h-full object-cover rounded-lg shadow-lg group-hover:blur-sm" />
					
					<div class="absolute inset-0 flex items-center justify-center">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" 
						stroke-width="1.5" stroke="currentColor"
						class="w-1/2 h-1/2 opacity-0 group-hover:opacity-100 group-hover:cursor-pointer transition-opacity duration-500 ease-in-out">
						<path stroke-linecap="round" stroke-linejoin="round" 
						d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
						</svg>
					</div>
				</label>
		</div>

			
			<!-- ! IMAGE  -->
		<div class="flex justify-center items-center editor-select">
			<div class="absolute left-0 flex-col items-center space-y-2 ml-15 mr-15 pt-4 justify-center">
				<label for="file-upload" class="flex">
				<input id="file-upload" type="" accept="image/*" class="hidden editor-select" data-type="avatar" />
				 <div id="img-div" class="relative w-32 h-32 group text-primary dark:text-dprimary">
					<img src=${API_CDN.AVATAR}/${userPref.avatar} class="w-full h-full rounded-full border-6 opacity-100 group-hover:opacity-0 transition-opacity duration-300 ease-in-out"
					alt="Profile picture">
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
					class="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out">
					<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
					</svg>
				</div>
				</label>
			</div>
		</div>
	</div>
	</div>
`};

function imageEditorDiv() {
	return `<div id="hidden-main-image-editor" class="w-full max-w-[1000px] hidden transition-all duration-500 transform translate-y-10 opacity-0 pointer-events-none
	  mt-4 justify-center items-center space-x-2 space-y-4">
	<div class="flex flex-row justify-center items-center gap-2 mt-4 px-50">
		  ${primaryButton({id: "save-image", text: "Save", translate: "save", weight: "1/2"})}
		  ${secondaryButton({id: "cancel-image", text: "Cancel",  translate: "cancel", weight: "1/2"})}
	</div>
	<div class="flex flex-col justify-center items-center w-full h-[648px] rounded-lg">
		<div id="tui-image-editor-container" class="rounded-xl"></div>
	</div>
	</div>`
}

function userUpdateForm(user: User) {
	return `
		${form({
		name : "saveChangeBasicUserInfo",
		inputs: [
			{
				name: "username",
				type: "text",
				labelClass: "font-title text-tertiary dark:text-dtertiary",
				value: user.username,
				autocomplete: "off",
				required: true,
				translate: "username",
			},
			{
				name: "email",
				type: "email",
				labelClass: "font-title text-tertiary dark:text-dtertiary",
				placeholder: user.email,
				value: user.email,
				autocomplete: "off",
				required: true,
				translate: "email",
			},
		],
		button: {
			id: "changeUserInfo",
			text: "Save changes",
			weight: "1/2",
			translate: "save-changes",
			type: "submit",
		},
		button2: {
			id: "change-password",
			text: "Change password",
			weight: "1/2",
			translate: "change-password",
		type: "button"
		},
	})}`
}

function notifications() {
	//TODO: Implementer fetch user waiting
	let content: string = "";
	const userWaiting = 0;

	if (userWaiting === 0) {
		content = '<span class="text-secondary dark:text-dtertiary" translate="no-notifications">No notifications</span>';
	}

	return `<div class="flex flex-col font-title title-responsive-size items-center justify-center space-y-4 pt-10 text-primary dark:text-dtertiary">
			<span traslate="notifications" >Notifications</span>
			<div class="flex flex-row font-title text-xl border-2 p-2 rounded-lg border-primary dark:border-dprimary">
			${content}
			</div>
			</div>`
}

async function renderProfilePage() {

	const response = await getUserInfo();
	if (response.status === "success" && response.data) {
		const user = response.data;

		return `
			${navbar(user)}
			${backButton()}
			<div class="flex flex-col font-title w-full justify-center items-center text-tertiary dark:text-dtertiary space-y-2 ">
			${avatarBanner(user.preferences)}
			${imageEditorDiv()}
			${userUpdateForm(user)}
			</div>
			${notifications()}
			${footer()}`
		}
		return notfound();
	}

export default function profilePage() {
	const container = renderProfilePage();
	return container;
}





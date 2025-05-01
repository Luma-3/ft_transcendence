import { navbar } from "../components/ui/navbar"
import { footer } from "../components/ui/footer"
import { fetchApi } from "../api/fetch"
import { API_ROUTES } from "../api/routes"
import { User } from "../api/interfaces/User"
import { alert } from "../components/ui/alert"
import { primaryButton } from "../components/ui/primaryButton"
import { form } from "../components/ui/form"
import { backButton } from "../components/ui/backButton"
import Swal from "sweetalert2"
import { headerPage } from "../components/ui/headerPage"
import notfound from "./404";


function profileName(nameProfil: string) {
	return `<h1 class="relative w-full p-2 text-4xl justify-center font-title text-center italic
	text-secondary dark:text-dtertiary overflow truncate">
	${nameProfil}
	</h1>`
}

function profilePicture(photoProfil: string) {
	return `<div id="img-div" class="relative w-32 h-32 group text-primary dark:text-dprimary">
		<img src="${photoProfil}" class="w-full h-full rounded-full border-2 opacity-100 group-hover:opacity-0 transition-opacity duration-300 ease-in-out"
		 alt="Profile picture">
		<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
		 class="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out">
		  <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
		</svg>
	</div>`
}

function profilePhotoChanger(userPicture: string) {
	return `
	<div class="flex flex-col items-center space-y-2 ml-15 mr-15 pt-4 justify-center">
		<label for="file-upload" class="flex">
		<input id="file-upload" type="" accept="image/*" class="hidden"  />
		${profilePicture(userPicture)}
		</label>
		</div>
	`}

import { alertTemporary } from "../components/ui/alert"
export async function messageUpdateUserInfo() {
	const lang = localStorage.getItem('lang') || sessionStorage.getItem('lang') || 'en';
	const theme = localStorage.getItem('theme') || 'dark';
	const trad = await loadTranslation(lang);
	const message = trad['user-infos-updated'];
	alertTemporary(message, theme);
}

import { secondaryButton } from "../components/ui/secondaryButton"
import { loadTranslation } from "../i18n/Translate"


function profileFormInfos(user: User) {
	return `
	<div class="flex flex-col font-title w-full justify-left items-center text-secondary dark:text-dtertiary space-y-2 pt-10">
	 <div class="flex font-title text-xl border-2 p-2 rounded-lg border-primary dark:border-dprimary" translate="your-informations"> 
	 Your informations
	 </div>

	 <div id="hidden-main-image-editor" class="hidden transition-all duration-500 transform translate-y-10 opacity-0 pointer-events-none
	  mt-4 w-[848px] justify-center items-center space-x-2 ">
	 	<div class="flex flex-col justify-center items-center w-full h-[648px] rounded-lg">
			<div id="tui-image-editor-container" class="rounded-xl"></div>
			</div>
			<div class="flex flex-row justify-between items-center gap-2 mt-4">
				${primaryButton({id: "save-image", text: "Save", weight: "1/2"})}
				${secondaryButton({id: "cancel-image", text: "Cancel", weight: "1/2"})}
			</div>
		</div>
	${profilePhotoChanger(user.pp_url)}

		${form({
		name : "saveChangeBasicUserInfo",
		inputs: [
			{
				name: "username",
				type: "text",
				labelClass: "font-title text-primary dark:text-dprimary",
				value: user.username,
				autocomplete: "off",
				required: true,
				translate: "username",
			},
			{
				name: "email",
				type: "email",
				labelClass: "font-title text-primary dark:text-dprimary",
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
			type: "button",
		},
	})}
	</div>`
}

async function renderProfilePage() {

	const userInfoResponse = await fetchApi<User>(API_ROUTES.USERS.INFOS,
		{method: "GET", credentials: "include"});
	
	
	if (userInfoResponse.status === "success" && userInfoResponse.data) {
		const userInfos = userInfoResponse.data;

		return `
			${navbar(userInfos)}
			${headerPage("profile")}
			${profileName(userInfos.username)}
			${profileFormInfos(userInfos)}
			<div class="flex flex-col">
			</div>
			${footer()}`
	}
	return notfound();
}

export default function profilePage() {
	const container = renderProfilePage();
	return container;
}





// function friendsList() {
// 	return `<div class="flex flex-col items-center justify-center space-y-4 pt-10 text-primary dark:text-dtertiary">
// 		<div class="flex font-title text-xl border-2 p-2 rounded-lg border-primary dark:border-dprimary"> 
// 			 Your friends
// 		 </div>
		
// 		<div class="items-center justify-center bg-primary dark:bg-dprimary w-1/2 h-1/2 rounded-lg shadow-lg">
// 		<ul class="flex flex-row space-x-5 items-center p-5 text-secondary dark:text-dprimary">
// 			<img src="/images/pp.jpg" alt="Profile picture"
// 			class="w-10 h-10 rounded-full border-4  border-green-600 shadow-lg">
// 			<li class="text-xl font-title  text-secondary dark:text-dtertiary" translate="friend1">Fred (Online)</li>
// 		</ul>
// 		<div class="flex justify-end m-2">
// 		${primaryButton({id: "add-friend" , text: "Add friend", weight: ""})}
// 		</div>
// 		</div>
// 		</div>`
// }

// function gameStatsResume() {
// 	return `<div class="flex flex-col pt-10 items-center justify-center space-y-4 text-primary dark:text-dtertiary">
// 			<div class="flex font-title text-xl border-2 p-2 rounded-lg border-primary dark:border-dprimary"> 
// 				 Your game results
// 			</div>
	
// 	<span class="text-xl font-title border-2 border-primary dark:border-dprimary p-2 "> wins 3 / losses 9</span>
// 	<div class="items-center justify-center bg-primary dark:bg-dprimary w-1/2 h-1/2 rounded-lg shadow-lg">
// 	<div class="flex font-title justify-start m-2 text-secondary"> Last games</div>
	
// 	<ul class="flex flex-row space-x-5 justify-center items-center p-5 text-secondary dark:text-dtertiary">
// 		<span class="flex justify-start text-xl font-title text-secondary dark:text-dtertiary"> 04/01/2925	</span>
// 	<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
// 		<path stroke-linecap="round" stroke-linejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0" />
// 		</svg>

// 		<li class="text-sm lg:text-xl font-title text-secondary dark:text-dtertiary" translate="friend1">You vs Jean-Rochefort</li>

// 		<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
// 		  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
// 			</svg>

// 	</ul>

// 	<div class="flex justify-end m-2">
// 	${primaryButton({id: "add-friend" , text: "See all games", weight: ""})}
// 	</div>
// 	</div>
// 	</div>`
// }
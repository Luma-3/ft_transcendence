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

// function profileLogo() {
// 	return `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
// 	class="size-20 mr-2 hover:animate-spin">
// 	<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
// 	</svg>`
// }

// function profileTitle() {
// 	return `<div class="text-6xl font-title p-2 items-center justify-center 
// 	text-tertiary dark:text-dtertiary 
// 	motion-reduce:animate-pulse" translate="profile">
// 	Profile
// 	</div>`
// }


function profileName(nameProfil: string | undefined) {
	return `<h1 class="relative w-full p-2 text-4xl justify-center font-title text-center italic
	text-tertiary dark:text-dtertiary overflow truncate">
	${nameProfil}
	</h1>`
}

function profilePicture(photoProfil: string | undefined) {
	return `<div class="relative w-32 h-32 group text-primary dark:text-dprimary">
		<img src="${photoProfil}" class="w-full h-full rounded-full border-2 opacity-100 group-hover:opacity-0 transition-opacity duration-300 ease-in-out"
		 alt="Profile picture">
		<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
		 class="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out">
		  <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
		</svg>
	</div>`
}

function profilePhotoChanger() {
	return `
	<div class="flex flex-col items-center space-y-2 ml-15 mr-15 pt-4 justify-center">
		<label for="file-upload" class="flex">
		<input id="file-upload" type="file" accept="image/*" class="hidden"  />
		${profilePicture("/images/pp.jpg")}
		</label>
	</div>`
}

export async function changeUserInfo() {
	Swal.fire({
	position: "center-end",
	toast: true,
	icon: "success",
	title: "Your informations have been changed",
	showConfirmButton: false,
	timer: 1500
	});
}



// export async function changePasswordUser() {
	
// 	const responseApiUser = await fetchApi<User>(API_ROUTES.USERS.INFOS,
// 		{method: "GET", credentials: "include"});
// 	if (responseApiUser.status === "success" && responseApiUser.data) {
// 		const userInfos = responseApiUser.data;
// 		// const lang = localStorage.getItem('lang') || sessionStorage.getItem('lang') || 'en';
// 		// const trad = await loadTranslation(lang);
		
// 		const theme = localStorage.getItem('theme') || 'dark';
// 		const bg = theme === 'dark' ? '#000000' : '#F8E9E9';
// 		const text = theme === 'dark' ? '#F8E9E9' : '#FF8904';
// 		const icon = theme === 'dark' ? '#FF8904' : '#FF8904';
// 		const confirmButtonColor = theme === 'dark' ? '#744FAC' : '#FF8904';
// 		const cancelButtonColor = theme === 'dark' ? '#FF8904' : '#744FAC';

// 		Swal.fire({
// 			title: "Change your informations",
// 			position: "top-end",
// 			icon: "info",
// 			background: bg,
// 			color: text,
// 			iconColor: icon,
// 			confirmButtonColor: confirmButtonColor,
// 			cancelButtonColor: cancelButtonColor,
			
// 			html: `
// 			<div class="flex flex-col justify-left items-left bg-primary dark:bg-dprimary text-tertiary dark:text-dtertiary p-4 rounded-lg">
// 				<label for="username-input" class="swal2-label font-title">Username</label>
// 				<input id="username-input" class="swal2-input font-title" value="${userInfos.username}" autocapitalize="off">
// 				<label for="email-input" class="swal2-label font-title">Email</label>
// 				<input id="email-input" type="email" class="swal2-input font-title" value="${userInfos.email}" placeholder="Email" autocapitalize="off">
// 			</div>
// 			`,
// 			showCancelButton: true,
// 			confirmButtonText: "Confirm",
// 			showLoaderOnConfirm: true,
		

// 			preConfirm: () => {
// 				const username = (document.getElementById('username-input') as HTMLInputElement).value;
// 				const email = (document.getElementById('email-input') as HTMLInputElement).value;
// 				if (!username || !email) {
// 					Swal.showValidationMessage('Please enter both username and email');
// 				}
// 				return { username, email };
// 			}
// 		}).then((result) => {
// 			if (result.isConfirmed) {
// 				Swal.fire({
// 					title: `Username: ${result.value?.username}, Email: ${result.value?.email}`,
// 				});
// 			}
// 		});
// 	}

// }


function profileFormInfos(user: User) {
	return `
	<div class="flex flex-col font-title w-full justify-left items-center text-tertiary dark:text-dtertiary space-y-2 pt-10">
	 <div class="flex font-title text-xl border-2 p-2 rounded-lg border-primary dark:border-dprimary" translate="your-informations"> 
	 Your informations
	 </div>
	${profilePhotoChanger()}

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

function friendsList() {
	return `<div class="flex flex-col items-center justify-center space-y-4 pt-10 text-primary dark:text-dtertiary">
		<div class="flex font-title text-xl border-2 p-2 rounded-lg border-primary dark:border-dprimary"> 
			 Your friends
		 </div>
		
		<div class="items-center justify-center bg-primary dark:bg-dprimary w-1/2 h-1/2 rounded-lg shadow-lg">
		<ul class="flex flex-row space-x-5 items-center p-5 text-secondary dark:text-dprimary">
			<img src="/images/pp.jpg" alt="Profile picture"
			class="w-10 h-10 rounded-full border-4  border-green-600 shadow-lg">
			<li class="text-xl font-title  text-secondary dark:text-dtertiary" translate="friend1">Fred (Online)</li>
		</ul>
		<div class="flex justify-end m-2">
		${primaryButton({id: "add-friend" , text: "Add friend", weight: ""})}
		</div>
		</div>
		</div>`
}

function gameStatsResume() {
	return `<div class="flex flex-col pt-10 items-center justify-center space-y-4 text-primary dark:text-dtertiary">
			<div class="flex font-title text-xl border-2 p-2 rounded-lg border-primary dark:border-dprimary"> 
				 Your game results
			</div>
	
	<span class="text-xl font-title border-2 border-primary dark:border-dprimary p-2 "> wins 3 / losses 9</span>
	<div class="items-center justify-center bg-primary dark:bg-dprimary w-1/2 h-1/2 rounded-lg shadow-lg">
	<div class="flex font-title justify-start m-2 text-secondary"> Last games</div>
	
	<ul class="flex flex-row space-x-5 justify-center items-center p-5 text-secondary dark:text-dtertiary">
		<span class="flex justify-start text-xl font-title text-secondary dark:text-dtertiary"> 04/01/2925	</span>
	<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
		<path stroke-linecap="round" stroke-linejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0" />
		</svg>

		<li class="text-sm lg:text-xl font-title text-secondary dark:text-dtertiary" translate="friend1">You vs Jean-Rochefort</li>

		<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
		  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
			</svg>

	</ul>

	<div class="flex justify-end m-2">
	${primaryButton({id: "add-friend" , text: "See all games", weight: ""})}
	</div>
	</div>
	</div>`
}

import { headerPage } from "../components/ui/headerPage"
function profileHeader(user: User) {
	return `
	${headerPage("profile")}
	${profileName(user.username)}`
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
				${friendsList()}
				${gameStatsResume()}
			</div>
			${footer()}`
	} else {
		return `${alert(userInfoResponse.message, "error")}`
	}
}

export function profilePage() {
	const container = renderProfilePage();
	return container;
}
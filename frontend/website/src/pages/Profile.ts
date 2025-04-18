import { navbar } from "../components/ui/navbar"
import { userMenu } from "../components/ui/userMenu"
import { footer } from "../components/ui/footer"
import { fetchApi } from "../api/fetch"
import { API_ROUTES } from "../api/routes"
import { User } from "../api/interfaces/User"
import { alertError } from "../components/ui/alertError"
import { primaryButton } from "../components/ui/primaryButton"
import { secondaryButton } from "../components/ui/secondaryButton"
function profilePicture(photoProfil: string | undefined) {
	return `<img src="${photoProfil}" alt="Profile picture" class="w-32 h-32 rounded-full border-4 border-primary dark:border-dprimary shadow-lg">`
}

function profileLogo() {
	return `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-20 mr-2 hover:animate-bounce">
 	 		<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
			</svg>
		`
}


function profileTitle() {
	return `<div class="text-6xl p-2 font-title items-center justify-center motion-reduce:animate-pulse" translate="profile">Profile</div>`
}


function renderProfileName(nameProfil: string | undefined) {
	return `<h1 class="text-3xl font-title text-center  border-secondary dark:border-dprimary">${nameProfil}</h1>`
}

function renderProfileHeader() {
	return `<div class="flex flex-col items-center text-primary dark:text-dtertiary justify-center space-y-4 pt-20">
				${profileLogo()}			
				${profileTitle()}
				${renderProfileName("Jean-MichMich")}
			</div>`
}

function selectPhotoProfil() {
	return `
	<div class="flex flex-col items-center space-y-4 ml-15 mr-15 pt-20 justify-center text-primary dark:text-dtertiary">
	${profilePicture("/images/pp.jpg")}			
	<div class="flex text-2xl font-title mt-4 mr-5 animate-pulse" translate="change-profil-picture">Change your profile picture</div>
				<label for="file-upload" class="flex">
				<span class="text-sm font-title p-2 bg-secondary dark:bg-dprimary rounded-sm
				hover:cursor-pointer hover:bg-primary hover:text-secondary hover:dark:bg-dtertiary hover:dark:text-dprimary" translate="choose-file"> Choose a file </span>
				<input id="file-upload" type="file" accept="image/*" class="hidden"  />
				</label>
			</div>`
}

function displayUserInfo(username: string | undefined) {
	return `
			<form type="POST" class="flex flex-col items-center justify-center ml-15 mr-15 pt-20 space-y-4 text-primary dark:text-dtertiary">
				
				<div class="flex flex-col w-full lg:flex-row lg:justify-center lg:space-x-4 lg:items-center gap-4">
					<div class="text-xl font-title" translate="username">Username</div>
					<input type="text" name="username" id="username" value="${username}" class="text-xl font-title border-2 border-secondary dark:border-dprimary p-5" />
					<div class="text-xl font-title" translate="email">Email</div>
						<input type="email" name="email" id="email" value="${username}" class="text-xl font-title border-2 border-secondary dark:border-dprimary p-5" />
					</div>
				
				<div class="flex flex-col w-full lg:flex-row lg:justify-center lg:space-x-4 lg:items-center gap-4">
					<div class="text-xl font-title w-50" translate="password">Password</div>
					<input type="password" name="password" id="password" value="${username}" class="text-xl font-title border-2 border-secondary dark:border-dprimary p-5" />
				</div>
				<div class="flex w-full lg:justify-center lg:items-center">
				${secondaryButton({id: "change-password" , text: "Change password", weight: ""})}
				</div>
				<div class="flex flex-col space-y-5 text-xl font-title justify-center items-center mt-5">
				${primaryButton({id: "save-profil" , text: "Save changes",  weight: ""})}
				</div>
			</form>
			`
}

function displayProfilInfo(){
	
	// const reponse = await fetchApi<User>(API_ROUTES.USERS.INFOS, { method: "GET", credentials: "include"})
	// if (reponse.status === "success") {
	// 	displayUserInfo(reponse.data?.username)
	// } else {
	// 	alertError(reponse.message)
	// }
	// console.log(displayUserInfo(reponse.data?.username))
	return displayUserInfo("Jean-MichMich") // TODO: remove this line when the API is ready
}



function friendsList() {
	return `<div class="flex flex-col items-center justify-center space-y-4 pt-20 text-primary dark:text-dtertiary">
		<div class="text-3xl font-title" translate="friends">Friends</div>
		
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
	return `<div class="flex flex-col pt-20 items-center justify-center space-y-4 text-primary dark:text-dtertiary">
	<div class="flex text-3xl font-title justify-center items-center" translate="last-game-stats">Games Result</div>
	
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

export function profilePage() {
	return `

	${navbar({username: "Jean-MichMich"})}
	${userMenu("Jean-MichMich")}
	${renderProfileHeader()}
	${displayProfilInfo()}
	${selectPhotoProfil()}
	<div class="flex flex-col">
	${friendsList()}
	${gameStatsResume()}
	</div>
	${footer()}`
}
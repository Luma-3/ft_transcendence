import { UserInfo } from '../../interfaces/User';
import { API_CDN } from '../../api/routes';
import { UserInPeople } from '../../interfaces/PeopleInterface';

let userNotification: boolean = false;

/**
 * Partie du menu situe en haut avec le nom de l'utilisateur et la photo de profil
 */
export function headerUserMenu(user: UserInfo) {
	return `<div class="flex flex-row py-3 px-2 items-center gap-2 rounded-sm bg-cover bg-center" style="background-image: url('${API_CDN.BANNER}/${user.preferences!.banner}')">
	<div class="relative w-14 h-14 flex-shrink-0">
					<img class="w-full h-full rounded-full" src="${API_CDN.AVATAR}/${user.preferences!.avatar}" alt="User profile picture">
				</div>
				</div>`;
}
export function headerOtherUserMenu(user: UserInPeople) {
	return `<div class="flex flex-row py-3 px-2 items-center gap-2 rounded-sm bg-cover bg-center" style="background-image: url('${API_CDN.BANNER}/${user.banner}')">
	<div class="relative w-14 h-14 flex-shrink-0">
					<img class="w-full h-full rounded-full" src="${API_CDN.AVATAR}/${user.avatar}" alt="User profile picture">
				</div>
				</div>`;
}
// <span class="p-1 block bg-primary dark:bg-dprimary shadow-md rounded-lg text-responsive-size font-title overflow-hidden truncate
//  text-tertiary dark:text-dsecondary">${user.username}</span>

/**
 * Partie du menu qui contient les options Profile, Stats, Settings
 */
function UserMenuOptions() {

	const listOption = [
		{ value: "profile", icon: `<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"/>` },
		{ value: "stats", icon: `<path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"/>` },
		{ value: "settings", icon: `
		<path stroke-linecap="round" stroke-linejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z" />
  	<path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />` },
	];
	const allOptions = listOption.map(element => {
		return `<li>
					<button id="load${element.value}" class="flex w-full items-center py-2 px-2 text-responsive-size font-title
					 hover:bg-primary dark:hover:bg-myblack dark:hover:text-dtertiary">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
						class="size-6 mr-2">
 							${element.icon}
						</svg>
						<div class="pointer-events-none" translate="${element.value}">${element.value}</div>
					</button>
				</li>`;
	}).join('');

	return `<ul class="py-1 text-tertiary dark:text-dtertiary" aria-labelledby="menu-dropdown">
				${allOptions}
			</ul>`;
		
}
/**
 * Fonction qui prent en charge le cursor sur le dark mode et le positionne a droite ou a gauche si le theme est dark ou light
 */
function darkMode(theme: string) {
	const isChecked = theme === 'light' ? 'checked' : '';
	return `<div class="flex items-center text-responsive-size justify-between py-2 px-4">
				<div translate="light-mode">Light mode</div>
					<div class="relative inline-block w-11 h-5">
					
						<input ${isChecked} id="switch-component" type="checkbox"
						class="peer appearance-none w-11 h-5 md:w-14 md:h-7 bg-slate-100 rounded-full
						 checked:bg-primary cursor-pointer transition-colors duration-300" />
					
						<label id="switch-component-label" for="switch-component"
						class="absolute top-0 left-0 w-5 h-5 md:w-8 md:h-7 bg-white rounded-full border 
						border-slate-300 shadow-sm transition-transform duration-300 peer-checked:translate-x-6
						 peer-checked:border-slate-800 cursor-pointer">
						</label>
					</div>
				</div>`;
}


function logout() {
	return `<button id="logout" translate="logout" 
	class="flex py-2 px-4 text-responsive-size w-full justify-left items-left
	dark:text-dsecondary hover:bg-primary dark:hover:bg-gray-600 dark:hover:text-white">
	Sign out
	</button>`
}


export function renderUserMenu(user: UserInfo) {
	//TODO: Verifier si l'utilisateur a des notifications pour les afficher
	return `
			${headerUserMenu(user)}
			${UserMenuOptions()}
			<ul class="font-title py-1 text-tertiary dark:text-dsecondary md:mr-2 lg:mr-"4 aria-labelledby="dropdown">
				<li> ${darkMode(user.preferences!.theme)}</li>
				<li> ${logout()}</li>
			</ul>`
}
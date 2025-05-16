import { User } from '../../api/interfaces/User';

/**
 * Partie du menu situe en haut avec le nom de l'utilisateur et la photo de profil
 */
function headerUserMenu(user: User) {
	return `<div class="flex flex-row py-3 px-2 items-center gap-2">
				<div class="relative w-12 h-12 flex-shrink-0">
					<img class="w-full h-full rounded-full" src="/images/pp.jpg" alt="User profile picture">
				</div>
				<span class="p-2 block text-responsive-size font-title overflow-hidden truncate
				 text-tertiary dark:text-dsecondary">${user.username}</span>
			</div>`;
}

/**
 * Partie du menu qui contient les options Profile, Stats, Settings
 */
function UserMenuOptions() {

	const listOption = [
		{ value: "profile", icon: "M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" },
		{ value: "stats", icon: "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" },
		{ value: "settings", icon: "M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" },
	];
	const allOptions = listOption.map(element => {
		return `<li>
					<button id="load${element.value}" class="flex w-full items-center py-2 px-2 text-responsive-size font-title
					 hover:bg-primary dark:hover:bg-myblack dark:hover:text-dtertiary">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
						class="size-6 mr-2">
 							<path stroke-linecap="round" stroke-linejoin="round" d="${element.icon}" />
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


export function renderUserMenu(user: User) {
	return `
			${headerUserMenu(user)}
			${UserMenuOptions()}
			<ul class="font-title py-1 text-tertiary dark:text-dsecondary md:mr-2 lg:mr-"4 aria-labelledby="dropdown">
				<li> ${darkMode(user.preferences.theme)}</li>
				<li> ${logout()}</li>
			</ul>`
}
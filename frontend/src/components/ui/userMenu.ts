import { IUserInfo } from '../../interfaces/IUser';
import { IOtherUser } from '../../interfaces/IUser';

/**
 * Partie du menu situe en haut avec le nom de l'utilisateur et la photo de profil
 */
export function headerUserMenu(user: IUserInfo) {
	return `<div class="flex flex-row py-3 px-2 items-center gap-2 rounded-sm bg-cover bg-center" style="background-image: url('${user.preferences!.banner}')">
	<div class="relative w-14 h-14 flex-shrink-0">
					<img class="w-full h-full rounded-full" src="${user.preferences!.avatar}" alt="User profile picture">
				</div>
				</div>`;
}

export function headerOtherUserMenu(user: IOtherUser) {
	return `<div class="flex flex-row py-3 px-2 items-center gap-2 rounded-sm bg-cover bg-center" style="background-image: url('${user.banner}')">
	<div class="relative w-14 h-14 flex-shrink-0">
					<img class="w-full h-full rounded-full" src="${user.avatar}" alt="User profile picture">
				</div>
				</div>`;
}

/**
 * Partie du menu qui contient les options Profile, Stats, Settings
 */
function UserMenuOptions() {

	const listOption = [
		{ value: "profile", icon: `duckProfileCrop.png` },
		{ value: "friends", icon: `duckSocialCrop.png` },
		{ value: "settings", icon: `duckSettingsCrop.png` },
	];
	const allOptions = listOption.map(element => {
		return `
		<li>
			<button id="load${element.value}" class="flex flex-row w-full mt-0.5 h-15 items-center overflow-hidden  transition-all duration-300 ease-in-out
			 hover:bg-primary dark:hover:bg-myblack hover:shadow-lg transform hover:scale-[1.02]
			 bg-gradient-to-r from-transparent via-transparent to-gray-100 dark:to-gray-800">

				<div class="flex items-center justify-start w-2/3 h-full px-4 text-responsive-size font-title pointer-events-none z-10
				text-tertiary dark:text-dtertiary group-hover:text-white transition-colors duration-300" translate="${element.value}">
					${element.value}
				</div>
						
				<div class="flex items-center justify-center w-1/3 h-full relative overflow-hidden
				bg-gradient-to-l from-primary/20 dark:from-dprimary/20 dark:to-transparent pointer-events-none">
					<div class="absolute invert dark:invert-0 inset-0 bg-no-repeat bg-center bg-contain
					opacity-70 hover:opacity-100 transition-opacity duration-300 filter hover:brightness-110"
					style="background-image: url('/images/${element.icon}')">
				</div>
				
				<div class="absolute inset-0 bg-gradient-to-l from-primary/10 dark:from-dprimary/10 to-transparent">
				</div>
			</button>
		</li>`;
	}).join('');

return `<ul class=" text-tertiary dark:text-dtertiary" aria-labelledby="menu-dropdown">
			${allOptions}
		</ul>`;
		
}

/**
 * Fonction qui prent en charge le cursor sur le dark mode et le positionne a droite ou a gauche si le theme est dark ou light
 */
function darkMode(theme: string) {
	const isChecked = theme === 'light' ? 'checked' : '';

return `
<div class="flex items-center text-responsive-size justify-between py-2 px-4">
	<div translate="light-mode">
	
	Light mode
	</div>

	<div class="relative inline-block w-11 h-5">

		<input ${isChecked} id="switch-component" type="checkbox"
		class="peer appearance-none w-11 h-5 md:w-14 md:h-7 bg-slate-100 rounded-full
			checked:bg-myblack cursor-pointer transition-colors duration-300" />
	
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
dark:text-dsecondary dark:hover:text-white hover:text-dtertiary hover:cursor-pointer">
Sign out
</button>`
}

function notifications() {
return `<button id="notifications" class="flex py-2 pl-4 text-responsive-size w-full justify-left items-left
dark:text-dsecondary dark:hover:text-white hover:text-dtertiary hover:cursor-pointer">
Notifications
</button>`;
}


export function userMenu(user: IUserInfo) {
return `
<div id="user-menu" class="hidden transition-all duration-500 transform translate-y-10 opacity-0 pointer-events-none absolute right-0 z-50 my-2 mx-4 w-56 md:w-70 lg:w-80text-tertiary rounded dark:text-dtertiary
bg-gradient-to-r dark:from-dprimary dark:to-gray-800 dark:to-grey-700 from-primary/80 to-primary">

	${headerUserMenu(user)}
	${UserMenuOptions()}
	<ul class="font-title text-tertiary dark:text-dsecondary md:mr-2 lg:mr-4 aria-labelledby="dropdown">
	
	<div> ${notifications()}</div>
		<div> ${darkMode(user.preferences!.theme)}</div>
		<div> ${logout()}</div>
	</ul>

</div>`
}
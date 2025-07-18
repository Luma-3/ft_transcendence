
import { navbar } from "../components/ui/navbar";
import { backButton } from "../components/ui/buttons/backButton";


import { IUserInfo } from "../interfaces/IUser";
import { renderErrorPage } from "../controllers/renderPage";
import { FetchInterface } from "../api/FetchInterface";
import { generateRankBadge } from "./Dashboard/rankBadges";
import { generateLastGames } from "./Dashboard/gameData";

function avatarBanner(userPref: any) {
return `
<div class="flex flex-col mb-20 items-center justify-center space-y-2 pt-4">
	
	<div id="banner-div" class="relative w-[1000px] h-64 editor-select ">
	
		<!-- ! BANNER  -->
		<div class="relative w-full h-full group" >
			
			<img src="${userPref.banner ?? 'default.webp'}" alt="Banner" 
			class="w-full h-full object-cover rounded-lg shadow-lg" />

		</div>

		<!-- ! IMAGE  -->
		<div class="flex justify-center items-center editor-select">
			
			<div class="absolute left-0 flex-col items-center space-y-2 ml-15 mr-15 pt-4 justify-center">
				
				<div id="img-div" class="relative w-32 h-32 group text-primary dark:text-dprimary">
					<img src=${userPref.avatar} class="w-full h-full rounded-full border-6"
					alt="Profile picture">
				</div>
			
			</div>
		</div>
	
	</div>
</div>`;
}

function userInfo(user: IUserInfo) {
return `
<div class=flex flex-col justify-center w-full max-w-[800px] space-y-4">

	<div class="flex">

		<span class="font-title text-4xl">
		${user.username}
		</span>

		
		</div>
		</div>`
	}
	// <span class="font-title text-2xl text-secondary dark:text-dtertiary ml-4">
	// ${user.created_at}
	// </span>

export async function renderOtherProfile(container: HTMLElement, myUser: IUserInfo) {

	const userId = container.dataset.id;
	if (!userId) {
		return renderErrorPage('404');
	}

	const user = await FetchInterface.getOtherUserInfo(userId);
	if (user === undefined) {
		return renderErrorPage('404');
	}

	return `
${await navbar(myUser)}
${backButton()}
<div class="flex flex-col font-title w-full justify-center items-center text-tertiary dark:text-dtertiary space-y-2 ">
	${avatarBanner(user.preferences)}
	${userInfo(user)}
	<div class="flex flex-col w-full justify-center items-center space-y-4 text-primary dark:text-dtertiary mb-10 ">
			<div class="flex flex-col w-full mb-10 max-w-[1000px] items-center justify-center pt-5">
				<!-- Badge de rang trop cool -->
				${await generateRankBadge(user)}
			</div>
		</div>
			<div class="flex w-full justify-center mb-4">
					<button id="toggleStats" class="px-4 py-2 rounded bg-dprimary text-white font-bold shadow hover:bg-dsecondary transition-colors duration-200">
						Voir les stats
					</button>
				</div>
		
				<!-- Bloc stats animé -->
				<div id="lastGamesContainer" class="w-full flex justify-center items-center pointer-events-none">
					<div id="lastGamesPanel" class="flex w-full justify-center pointer-events-auto transform translate-x-full opacity-0 transition-all duration-500">
						${await generateLastGames(user)}
					</div>
				</div>
</div>`
}



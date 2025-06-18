import notfound from "./4xx";

import { navbar } from "../components/ui/navbar";

import { backButton } from "../components/ui/buttons/backButton";

import { getFriends, getOtherUserInfo } from "../api/getterUser(s)";
import { API_CDN } from "../api/routes";
import { User } from "../interfaces/User";

function avatarBanner(userPref: {avatar: string, banner: string}) {
	return `
	<div class="flex flex-col mb-20 items-center justify-center space-y-2 pt-4">
	<div id="banner-div" class="relative w-[1000px] h-64 editor-select ">
		
		<!-- ! BANNER  -->
		<div class="relative w-full h-full group" >
					<img src="${API_CDN.BANNER}/${userPref.banner ?? 'default.webp'}" alt="Banner" 
					class="w-full h-full object-cover rounded-lg shadow-lg" />
		</div>

		<!-- ! IMAGE  -->
		<div class="flex justify-center items-center editor-select">
			<div class="absolute left-0 flex-col items-center space-y-2 ml-15 mr-15 pt-4 justify-center">
				 <div id="img-div" class="relative w-32 h-32 group text-primary dark:text-dprimary">
					<img src=${API_CDN.AVATAR}/${userPref.avatar} class="w-full h-full rounded-full border-6"
					alt="Profile picture">
				</div>
			</div>
		</div>
	</div>
	</div>`;
}

function userInfo(user: User) {
	return `
	<div class=flex flex-col justify-center w-full max-w-[800px] space-y-4">
	<div class="flex">
		<span class="font-title text-4xl"> ${user.username}</span>
		<span class="font-title text-2xl text-secondary dark:text-dtertiary ml-4">
		${user.created_at}</span>
	</div> `
}

async function friends(user:User) {
	let container = `
			<div class="flex flex-col overflow-auto font-title title-responsive-size items-center justify-center space-y-4 pt-10 text-primary dark:text-dtertiary">
				<span traslate="friends" >Friends</span>
			<div class="flex flex-col w-full max-h-[400px] overflow-auto font-title title-responsive-size items-center justify-center space-y-4 text-primary dark:text-dtertiary">
			`;
	const friendsList = await getFriends();
	if (friendsList.status === "error" || !friendsList.data) {
		return `${container}<span class="text-secondary dark:text-dtertiary" translate="no-friends">No friends found</span></div>`;
	}
	for(const friend of friendsList.data) {
		console.log("Friend:", friend);
		container += `
		<div class="flex flex-row justify-between w-1/2 font-title text-xl border-2 p-2 rounded-lg border-primary dark:border-dprimary">
			<span>${friend.username}</span>
			<div class="flex flex-row space-x-2">
				<div id="add-friend" data-username=${friend.username} data-id=${friend.id} class="group/item relative hover:cursor-pointer">
					<span class="tooltip absolute left-1/2 -translate-x-1/2 top-full mb-1 hidden group-hover/item:block bg-primary text-tertiary dark:bg-dprimary 
				dark:text-dtertiary text-xs rounded py-1 px-2">
					Add to friends
					</span>
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 pointer-events-none hover:cursor-pointer">
					<path stroke-linecap="round" stroke-linejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
					</svg>
					</span>
				</div>
				<div class="group/item relative">
					<span class="tooltip absolute left-1/2 -translate-x-1/2 top-full mb-1 hidden group-hover/item:block bg-primary text-tertiary dark:bg-dprimary 
				dark:text-dtertiary text-xs rounded py-1 px-2 z-10">
					Chat with ${friend.username}
					</span>
					<span> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 hover:cursor-pointer">
					<path stroke-linecap="round" stroke-linejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
					</svg>
					</span>
				</div>
			</div>
		</div>
		`;
	}
	container += `</div>`;
	console.log("Friends List:", friendsList.data);
	return container;
}

export async function renderOtherProfile(container: HTMLElement) {

	console.log("Rendering other profile page...");
	const userId = container.dataset.id;
	const response = await getOtherUserInfo(userId!);
	if (response.status === "success" && response.data) {
		const user = response.data;

		return `
			${navbar(user)}
			${backButton()}
			<div class="flex flex-col font-title w-full justify-center items-center text-tertiary dark:text-dtertiary space-y-2 ">
			${avatarBanner(user.preferences)}
			${userInfo(user)}
			</div>`
		}
		return notfound();
}



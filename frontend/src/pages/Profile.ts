
import notfound from "./4xx";

import { navbar } from "../components/ui/navbar"
import { form } from "../components/ui/form/form"

import { primaryButton } from "../components/ui/buttons/primaryButton"
import { secondaryButton } from "../components/ui/buttons/secondaryButton"
import { backButton } from "../components/ui/buttons/backButton";

import { User } from "../interfaces/User"
import { getAllUsers, getFriends, getOtherUserInfo, getUserInfo } from "../api/getterUser(s)"
import { API_CDN } from "../api/routes";

function avatarBanner(userPref: {avatar: string, banner: string}) {
	return `
	<div class="flex flex-col max-w-[400px] lg:max-w-[1000px] mb-20 items-center justify-center space-y-2 pt-4">
	<div id="banner-div" class="relative w-[500px] lg:w-[1000px] h-64 editor-select ">
		
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

async function notifications() {
	const users = await getFriends();
	
	let content: string = `<div class="flex flex-col font-title title-responsive-size items-center justify-center space-y-4 text-primary dark:text-dtertiary">`;
	const pendingInvitations = users.data?.pending;
	if (!pendingInvitations || pendingInvitations.length === 0) {
		return `${content}
		<span class="text-secondary dark:text-dtertiary" translate="no-notifications">No notifications</span>
		</div>`;
	}
	
	for (const invitation of pendingInvitations) {
		if (invitation && invitation.status === "receiver") {
			content += `
			<div class="flex flex-row justify-between w-full space-x-4 font-title text-xl border-2 p-2 rounded-lg border-primary dark:border-dprimary">
				<div class="flex font-title">${invitation.username} wants to be your friend</div>
					<div id="accept-friend" data-id="${invitation.user_id}" data-username="${invitation.username}" 
					class="hover:cursor-pointer">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 pointer-events-none">
						<path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
						</svg>
					</div>
					<div id="refuse-invitation" data-id="${invitation.user_id}" data-username="${invitation.username}" class="hover:cursor-pointer">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 pointer-events-none">
						<path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
						</svg>
					</div>
			</div>
		</div>`
		}
	}

	return `<div class="flex flex-col font-title title-responsive-size items-center justify-center space-y-4  text-primary dark:text-dtertiary">
			<span traslate="notifications" >Notifications</span>
			<div class="flex flex-row font-title text-xl border-2 p-2 rounded-lg border-primary dark:border-dprimary">
			${content}
			</div>
			</div>`
}



async function friends(user:User) {
	let container = `
			<div class="flex flex-col w-full overflow-visible font-title title-responsive-size items-center justify-center space-y-4 pt-10 text-primary dark:text-dtertiary">
			<div class="flex flex-row justify-between items-center space-x-4">
					<img src="/images/duckSocial.png" alt="Duck Friends" class="w-20 h-20" />	
					<span translate="friends">Friends</span>
				</div>
			<div class="flex flex-col w-full h-[400px] font-title title-responsive-size items-center justify-center space-y-4 text-primary dark:text-dtertiary">
			`;
	const friendsList = await getFriends();
	if (friendsList.status === "error" || !friendsList.data?.friends) {
		return `${container}<span class="text-secondary dark:text-dtertiary" translate="no-friends">No friends found</span></div></div>`;
	}
	for(const friend of friendsList.data.friends) {
		container += `
		<div class="flex flex-col sm:flex-row justify-between w-[300px] font-title text-xl border-2 p-2 rounded-lg border-primary dark:border-dprimary">
			<div name="otherProfile" data-id=${friend.user_id} class="flex font-title hover:underline hover:cursor-pointer">${friend.username}</div>
			<div class="flex flex-row space-x-2">
				<div id="block-user" data-username=${friend.username} data-id=${friend.user_id} class="group/item relative hover:cursor-pointer">
					<span class="tooltip absolute z-10 left-1/2  top-full mb-1 hidden group-hover/item:block bg-primary text-tertiary dark:bg-dprimary 
				dark:text-dtertiary text-xs rounded py-1 px-2">
					Block This MotherDucker
					</span>
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
					<path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
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
	container += `
		</div>
	</div>`;
	return container;
}
import { UserInPeople } from "../interfaces/PeopleInterface";
function lockOrUnlockButton(user: UserInPeople) {
	if (user.bloked) {
		return `<div id="unlock-user" data-username=${user.username} data-id=${user.user_id} class="group/item relative hover:cursor-pointer">
					<span class="tooltip absolute left-1/2 z-10 -translate-x-1/2 top-full mb-1 hidden group-hover/item:block bg-primary text-tertiary dark:bg-dprimary 
				dark:text-dtertiary text-xs rounded py-1 px-2">
					Unlock this MotherDUcker
					</span>
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
					<path stroke-linecap="round" stroke-linejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 1 1 9 0v3.75M3.75 21.75h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H3.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
					</svg>
					</span>
				</div>`;
	}
	return `<div id="add-friend" data-username=${user.username} data-id=${user.user_id} class="group/item relative hover:cursor-pointer">
					<span class="tooltip absolute left-1/2 z-10 -translate-x-1/2 top-full mb-1 hidden group-hover/item:block bg-primary text-tertiary dark:bg-dprimary 
				dark:text-dtertiary text-xs rounded py-1 px-2">
					Add to friends
					</span>
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 pointer-events-none hover:cursor-pointer">
					<path stroke-linecap="round" stroke-linejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
					</svg>
					</span>
				</div>`
}

import { headerUserMenu } from "../components/ui/userMenu";

async function allUsers(user:User) {
	let container = `
			<div class="flex flex-col w-full overflow-visible font-title title-responsive-size items-center justify-center space-y-4 pt-10 text-primary dark:text-dtertiary">
				<div class="flex flex-row justify-between items-center space-x-4">
					<img src="/images/duckCrowd.png" alt="Duck Friends" class="w-20 h-20" />	
					<span translate="allUsers">All users</span>
				</div>
			<div class="relative h-[400px] w-full overflow-y-auto font-title title-responsive-size items-center justify-center space-y-4 text-primary dark:text-dtertiary">
				<div class="flex flex-col w-full justify-center items-center gap-4 p-4">`;
	
	const allUsers = await getAllUsers();
	
	if (allUsers.status === "error" || !allUsers.data) {
		return `${container}<span class="text-secondary dark:text-dtertiary" translate="no-friends">No friends found</span></div></div>`;
	}
	
	for(const user of allUsers.data) {
		const userData = await getOtherUserInfo(user.user_id);
		container += `
		<div class="flex flex-col justify-between w-[300px] font-title text-xl border-2 p-2 rounded-lg border-primary dark:border-dprimary">
			${headerUserMenu(userData.data!)}
			<div class="flex flex-row justify-between items-center space-x-4 mt-4">
				<div name="otherProfile" data-id=${user.user_id} class="flex font-title truncate hover:underline hover:cursor-pointer">${user.username}
				</div>
				
				<div class="flex flex-row space-x-2">
					${lockOrUnlockButton(user)}
					<div class="group/item relative">
							<span class="tooltip z-15 absolute left-1/2 -translate-x-1/2 top-full mb-1 hidden group-hover/item:block bg-primary text-tertiary dark:bg-dprimary 
						dark:text-dtertiary text-xs rounded py-1 px-2">
							Chat with ${user.username}
							</span>
							<span> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 hover:cursor-pointer">
							<path stroke-linecap="round" stroke-linejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
							</svg>
							</span>
						</div>
				</div>
			</div>
		</div>
		`;
	}
	container += `
		</div>
		</div>
	</div>
	`;
	console.log("Friends List:", allUsers.data);
	return container;
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
			<div class="flex flex-col w-full justify-center items-center space-y-4 text-primary dark:text-dtertiary">
			<div class="flex flex-col w-full max-w-[1000px] items-center justify-center pt-5">
			<img src="/images/duckBell.png" alt="Duck Bell" class="w-20 h-20" />
			${await notifications()}
			</div>
			</div>
			<div class="flex flex-col justify-center items-center">
				<div class="flex flex-row justify-between items-center w-full max-w-[1500px] space-x-4 space-y-4">
				${await friends(user)}
				${await allUsers(user)}
				</div>
		<div class="flex h-[100px]"></div>

			</div>
			</div>`
		}
		return notfound();
	}

export default function profilePage() {
	const container = renderProfilePage();
	return container;
}





import { navbar } from "../../components/ui/navbar"

import { primaryButton } from "../../components/ui/buttons/primaryButton"
import { secondaryButton } from "../../components/ui/buttons/secondaryButton"
import { backButton } from "../../components/ui/buttons/backButton";

import { UserInfo } from "../../interfaces/User"
import { userUpdateForm } from "./updateForm";
import { notifications } from "./notifications";
import { friends } from "./friendsList";
import { allUsers } from "./allUserList";
import { profileHeader } from "./header";
import { getBlockedUsers } from "../../api/getterUser(s)";
import { headerOtherUserMenu } from "../../components/ui/userMenu";


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

async function blockList(user: UserInfo) {
	let container = `
				<div class="flex flex-col w-full overflow-visible font-title title-responsive-size items-center justify-center space-y-4 pt-10 text-tertiary dark:text-dtertiary">
				<div class="flex flex-row justify-between items-center space-x-4">
						<img src="/images/duckPolice.png" alt="Duck Friends" class="w-20 h-20" />	
						<span translate="blacklist">BlackList</span>
					</div>
				<div class="flex flex-col w-full h-[400px] font-title title-responsive-size items-center justify-center space-y-4 gap-4 p-4 text-primary dark:text-dtertiary">
				`;
		const blockedUsers = await getBlockedUsers();

		if (blockedUsers.status === "error" || blockedUsers.data?.length == 0) {
			return `${container}</div></div>`;
		}
		
		for(const user of blockedUsers.data!) {
			container += `<div class="flex flex-col justify-between w-[300px] font-title text-xl border-2 p-2 rounded-lg border-primary dark:border-dprimary">
				${headerOtherUserMenu(user)}
				<div class="flex flex-row justify-between items-center space-x-4 mt-4">
					<div name="otherProfile" data-id=${user.id} class="flex font-title truncate hover:underline hover:cursor-pointer">${user.username}
					</div>
	
				<div class="flex flex-row space-x-2">
					<div id="block-user" data-username=${user.username} data-id=${user.id} class="group/item relative hover:cursor-pointer">
						<span class="tooltip absolute z-10 left-1/2  top-full mb-1 hidden group-hover/item:block bg-primary text-tertiary dark:bg-dprimary 
					dark:text-dtertiary text-xs rounded py-1 px-2"
							translate="unblock-motherducker">
						Unblock This MotherDucker
						</span>
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 pointer-events-none">
					<path stroke-linecap="round" stroke-linejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 1 1 9 0v3.75M3.75 21.75h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H3.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
				</svg>
					</div>
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

async function renderProfilePage(user: UserInfo) {
	return `
		${navbar(user)}
		${backButton()}
		<div class="flex flex-col font-title w-full justify-center items-center text-tertiary dark:text-dtertiary space-y-2 ">
			${profileHeader({ avatar: user.preferences!.avatar, banner: user.preferences!.banner || 'default.webp' })}
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
			<div class="flex flex-col md:flex-row justify-between items-center w-full max-w-[1500px] space-x-4 space-y-4">
			${await friends(user)}
			${await allUsers(user)}
			${await blockList(user)}
			</div>
		<div class="flex h-[100px]"></div>
		</div>`
	}

export default function profilePage(user: UserInfo) {
	const container = renderProfilePage(user);
	return container;
}





import { navbar } from "../../components/ui/navbar"

import { primaryButton } from "../../components/ui/buttons/primaryButton"
import { secondaryButton } from "../../components/ui/buttons/secondaryButton"
import { backButton } from "../../components/ui/buttons/backButton";

import { UserInfo } from "../../interfaces/User"
import { userUpdateForm } from "./updateForm";
import { notifications } from "./notifications";
import { profileHeader } from "./header";
import { allUsersList } from "./allUsersList";
import { friendsList } from "./friendsList";
import { blockList } from "./blockList";


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


async function renderProfilePage(user: UserInfo) {
	return `
		${navbar(user)}
		${backButton()}
		<div class="flex flex-col font-title w-full justify-center items-center text-tertiary dark:text-dtertiary space-y-2 ">
			${profileHeader({ avatar: user.preferences!.avatar, banner: user.preferences!.banner || 'default.webp' })}
			${imageEditorDiv()}
			<div id="updateForm" class="flex flex-col w-full items-center justify-center pt-5">
			${userUpdateForm(user)}
			</div>
		</div>
		<div class="flex flex-col w-full justify-center items-center space-y-4 text-primary dark:text-dtertiary">
			<div class="flex flex-col w-full max-w-[1000px] items-center justify-center pt-5">
				<img src="/images/duckBell.png" alt="Duck Bell" class="w-20 h-20" />
				${await notifications()}
			</div>
		</div>
		<div class="flex flex-col justify-center items-center">
			<div class="flex flex-col lg:flex-row justify-between items-center w-full max-w-[1500px] space-x-4 space-y-4">
			<div id="friends-div" class="flex flex-col w-full max-w-[1000px]">
			${await friendsList()}
			</div>
			<div id="all-users-div" class="flex flex-col justify-center w-full max-w-[1000px]">
			${await allUsersList()}
			</div>
			<div id="block-div" class="flex flex-col w-full max-w-[1000px]">
			${await blockList()}
			</div>
			</div>
		<div class="flex h-[100px]"></div>
		</div>`
	}

export default function profilePage(user: UserInfo) {
	const container = renderProfilePage(user);
	return container;
}





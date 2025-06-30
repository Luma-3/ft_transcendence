import { backButton } from "../../components/ui/buttons/backButton";
import { navbar } from "../../components/ui/navbar";
import { IUserInfo } from "../../interfaces/IUser";
import { allUsersList } from "./allUsersList";
import { blockList } from "./blockList";
import { friendsList } from "./friendsList";

async function renderFriendsPage(user: IUserInfo) {
return `
${navbar(user)}
${backButton()}

<div class="flex flex-col w-full justify-center items-center space-y-4 text-primary dark:text-dtertiary">


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
	<div class="flex h-[100px]">
	</div>

</div>`
	}

export default function friends(user: IUserInfo) {
	const container = renderFriendsPage(user);
	return container;
}

	// <div class="flex flex-col w-full max-w-[1000px] items-center justify-center pt-5">

	// 	<img src="/images/duckBell.png" alt="Duck Bell" class="w-20 h-20" />
	// 	${await notifications()}

	// </div>

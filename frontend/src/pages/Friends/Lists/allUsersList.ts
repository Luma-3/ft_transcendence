import { FetchInterface } from '../../../api/FetchInterface';
import { headerOtherUserMenu } from "../../../components/ui/userMenu";
import { IOtherUser } from '../../../interfaces/IUser';

export async function allUsersList() {
let container = `
<div class="flex flex-col w-full overflow-visible font-title title-responsive-size items-center justify-center space-y-4 pt-5 text-tertiary dark:text-dtertiary">
	
	<div class="relative h-[400px] w-full overflow-y-auto font-title title-responsive-size items-center z-10 justify-center space-y-4 text-primary dark:text-dtertiary">

		<div class="grid grid-cols-1 gap-4 p-4">`;
		
		const allUsers = await FetchInterface.getAllUser('all');
		if (!allUsers) {
			return `${container}</div></div>`;
		}
		
		for(const otherUser of allUsers.users) {
		container += `
			<div id="user-${otherUser.id}" class="flex flex-col justify-between w-full font-title text-xl border-2 p-2 rounded-lg border-primary dark:border-dprimary text-secondary
			bg-myblack from-primary to-secondary">
			
				${headerOtherUserMenu(otherUser)}
				
				<div class="flex flex-row justify-between items-center space-x-4 mt-4">
				
					<div name="otherProfile" data-id=${otherUser.id} class="flex font-title truncate hover:underline hover:cursor-pointer">
					
					${otherUser.username}

					</div>

					<div class="flex flex-row space-x-2">

						${addFriendButton(otherUser)}

						<div id="block-user" data-username=${otherUser.username} data-id=${otherUser.id} class="group/item relative hover:cursor-pointer">

							<span class="tooltip absolute z-10 left-1/2 transform -translate-x-full -top-8 mb-1 hidden group-hover/item:block bg-primary text-secondary dark:bg-dprimary dark:text-dtertiary text-xs rounded py-1 px-2 whitespace-nowrap" translate="block-motherducker">

								Block This MotherDucker
							
							</span>
						
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 pointer-events-none">
								<path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
							</svg>

						</div>
					</div>
				</div>
			</div>`;
}

container += `
		</div>
	</div>
</div>`;

return container;
}

function addFriendButton(user: IOtherUser) {
return `
<div id="add-friend" data-username=${user.username} data-id=${user.id} class="group/item relative hover:cursor-pointer">
	
	<span class="tooltip absolute z-10 left-1/2 transform -translate-x-full -top-8 mb-1 hidden group-hover/item:block bg-primary text-secondary dark:bg-dprimary dark:text-dtertiary text-xs rounded py-1 px-2 whitespace-nowrap" translate="add-friend">

		Add Friend
							
							</span>
		<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 pointer-events-none hover:cursor-pointer">
			<path stroke-linecap="round" stroke-linejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
		</svg>
	</span>
</div>`
}
import { FetchInterface } from '../../../api/FetchInterface';
import { headerOtherUserMenu } from '../../../components/ui/userMenu';


export async function friendsList() {
let container = `
<div class="flex flex-col w-full overflow-visible font-title title-responsive-size items-center justify-center space-y-4 pt-5 text-tertiary dark:text-dtertiary">

	<div class="relative h-[400px] w-full z-10 overflow-y-auto font-title title-responsive-size items-center justify-center space-y-4 text-primary dark:text-dtertiary">

		<div class="flex flex-col w-full justify-center items-center gap-4 p-4">`;
	
	const friendsList = await FetchInterface.getFriends();
	if (!friendsList) {
		return `${container}</div></div></div>`;
	}
	
	for(const friend of friendsList) {
		container += `
		<div id="friend-${friend.id}"
	class="flex flex-col justify-between w-full font-title text-xl border-2 p-2 rounded-lg border-primary dark:border-dprimary text-secondary
			bg-myblack from-primary to-secondary">
			
			${headerOtherUserMenu(friend)}
			
			<div class="flex flex-row justify-between items-center space-x-4 mt-4 text-secondary">
				
				<div name="otherProfile" data-id=${friend.id} class="flex font-title truncate hover:underline hover:cursor-pointer">
				
				${friend.username}
				
				</div>

				<div class="flex flex-row space-x-2">
					
					<div id="block-user" data-username=${friend.username} data-id=${friend.id} class="group/item relative hover:cursor-pointer">
						
						<span class="tooltip absolute z-10 left-1/2  top-full mb-1 hidden group-hover/item:block bg-primary text-tertiary dark:bg-dprimary 
					dark:text-dtertiary text-xs rounded py-1 px-2"
							translate="block-motherducker">
						
							Block This MotherDucker
						
						</span>
						
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 pointer-events-none">
						<path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
						</svg>
					
					</div>

					<div id="unfriend-user" data-username=${friend.username} data-id=${friend.id} class="group/item relative hover:cursor-pointer">
						
						<span class="tooltip absolute left-1/2 -translate-x-1/2 top-full mb-1 hidden group-hover/item:block bg-primary text-tertiary dark:bg-dprimary 
					dark:text-dtertiary text-xs rounded py-1 px-2 z-10"
						translate="unfriend-user">
						
						Unfriend ${friend.username}
						
						</span>
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 pointer-events-none">
							<path stroke-linecap="round" stroke-linejoin="round" d="M22 10.5h-6m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM4 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 10.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
						</svg>
					
					</div>
				</div>
			</div>
		</div>
		`;
	}

container += `
		</div>
	</div>
</div>`;

return container;
}
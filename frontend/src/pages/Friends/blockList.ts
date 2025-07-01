import { getBlockedUsers } from '../../api/getterUser(s)';
import { headerOtherUserMenu } from '../../components/ui/userMenu';


export async function blockList() {
let container = `
<div class="flex flex-col w-full overflow-visible font-title title-responsive-size items-center justify-center space-y-4 pt-5 text-tertiary dark:text-dtertiary">

	<div class="relative h-[400px] w-full z-10 overflow-y-auto font-title title-responsive-size items-center justify-center space-y-4 text-primary dark:text-dtertiary">

		<div class="flex flex-col w-full justify-center items-center gap-4 p-4">`;

		const blockedUsers = await getBlockedUsers();

		if (blockedUsers.status === "error" || blockedUsers.data?.length == 0) {
			return `${container}</div></div></div>`;
		}
		
		for(const user of blockedUsers.data!) {
			container += `
				<div id="user-${user.id}" class="flex flex-col justify-between w-full font-title text-xl border-2 p-2 rounded-lg border-primary dark:border-dprimary text-secondary
			bg-myblack from-primary to-secondary">

				${headerOtherUserMenu(user)}

				<div class="flex flex-row justify-between items-center space-x-4 mt-4">
					
					<div name="otherProfile" data-id=${user.id} class="flex font-title truncate hover:underline hover:cursor-pointer">
					
					${user.username}
					
					</div>
	
					<div class="flex flex-row space-x-2">
					
						<div id="unblock-user" data-username=${user.username} data-id=${user.id} class="group/item relative hover:cursor-pointer">
							
							<span class="tooltip absolute z-50 right-1/2  top-full mb-1 hidden group-hover/item:block bg-primary text-tertiary dark:bg-dprimary 
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
			</div>`;
}

container += `
		</div>
	</div>
</div>`;

return container;

}
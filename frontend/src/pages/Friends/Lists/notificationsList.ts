import { getNotifications } from "../../../api/getterUser(s)";
import { headerOtherUserMenu } from "../../../components/ui/userMenu";
import { IUserInfo } from "../../../interfaces/IUser";

export async function notificationList(invitation: IUserInfo) {

let container = `
<div class="flex flex-col w-full overflow-visible font-title title-responsive-size items-center justify-center space-y-4 pt-5 text-tertiary dark:text-dtertiary">
	
	<div class="relative h-[400px] w-full overflow-y-auto font-title title-responsive-size items-center z-10 justify-center space-y-4 text-primary dark:text-dtertiary">

		<div class="grid grid-cols-1 gap-4 p-4">`;

		const results = await Promise.all([
		
			getNotifications(),
			getNotifications("receiver")
		
		]);
		
		if (results[0].status === "error" || results[1].status === "error") {
		return `${container}</div></div>`; }

		const invitationSent = results[0].data!;
		const invitationReceived = results[1].data!;

		for(const invitation of invitationSent) {

			container += `
			<div id="user-${invitation.id}" class="flex flex-col justify-between w-full font-title text-xl border-2 p-2 rounded-lg border-primary dark:border-dprimary text-secondary
			bg-myblack from-primary to-secondary">

				${headerOtherUserMenu(invitation)}

				<div class="flex flex-row justify-between items-center space-x-4 mt-4">
					
					<div name="otherProfile" data-id=${invitation.id} class="flex font-title truncate hover:underline hover:cursor-pointer">
					
					${invitation.username}
					
					</div>
	
					<div class="flex flex-row space-x-2 items-center">
						Waiting ...
							<div id="cancel-invitation" data-id="${invitation.id}" data-username="${invitation.username}" class="ml-4 justify-end hover:cursor-pointer  group/item relative ">
								<span class="tooltip absolute z-10 left-1/2 transform -translate-x-full -top-8 mb-1 hidden group-hover/item:block bg-primary text-secondary dark:bg-dprimary dark:text-dtertiary text-xs rounded py-1 px-2 whitespace-nowrap" translate="cancel-invitation">
								Cancel this invitation
								</span>
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-6 pointer-events-none">
								<path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
								</svg>
						</div>
					</div>
				</div>
			</div>`;

		for(const invitation of invitationReceived) {

			container += `
			<div id="user-${invitation.id}" class="flex flex-col justify-between w-full font-title text-xl border-2 p-2 rounded-lg border-primary dark:border-dprimary text-secondary
			bg-myblack from-primary to-secondary">

				${headerOtherUserMenu(invitation)}

				<div class="flex flex-row justify-between items-center space-x-4 mt-4">
					
					<div name="otherProfile" data-id=${invitation.id} class="flex font-title truncate hover:underline hover:cursor-pointer">
					
					${invitation.username}
					
					</div>
	
					<div class="flex flex-row space-x-2 items-center">
						Waiting ...
							<div id="cancel-invitation" data-id="${invitation.id}" data-username="${invitation.username}" class="ml-4 justify-end hover:cursor-pointer  group/item relative ">
								<span class="tooltip absolute z-10 left-1/2 transform -translate-x-full -top-8 mb-1 hidden group-hover/item:block bg-primary text-secondary dark:bg-dprimary dark:text-dtertiary text-xs rounded py-1 px-2 whitespace-nowrap" translate="cancel-invitation">
								Cancel this invitation
								</span>
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-6 pointer-events-none">
								<path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
								</svg>
						</div>
					</div>
				</div>
			</div>`;
		}
}

container += `
		</div>
	</div>
</div>`;

	return container;
}

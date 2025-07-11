import { FetchInterface } from "../../../api/FetchInterface";
import { headerOtherUserMenu } from "../../../components/ui/userMenu";
import { loadTranslation } from "../../../controllers/Translate";

export async function notificationList() {
	const user = await FetchInterface.getUserInfo();
	if (!user) {
		return;
	}

	const trad = await loadTranslation(user.preferences.lang);

let container = `
<div class="flex flex-col w-full overflow-visible font-title title-responsive-size items-center justify-center space-y-4 pt-5 text-tertiary dark:text-dtertiary">
	
	<div class="relative h-[400px] w-full overflow-y-auto font-title title-responsive-size items-center z-10 justify-center space-y-4 text-primary dark:text-dtertiary">

		<div class="grid grid-cols-1 gap-4 p-4">`;

		const results = await Promise.all([
			FetchInterface.getNotifications(),
			FetchInterface.getNotifications("receiver")
		
		]);
		console.log("results in LIST", results);

		const invitationSent = results[0] ?? [];
		const invitationReceived = results[1] ?? [];
		console.log("invitationSent", invitationSent);
		console.log("invitationReceived", invitationReceived);
		
		for(const invitation of invitationSent) {
			if (!invitation) continue;
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
							<div id="cancel-invitation" data-id="${invitation.id}" data-username="${invitation.username}" class="ml-4 justify-end hover:cursor-pointer group/item relative">
								<span class="tooltip absolute z-10 left-1/2 transform -translate-x-full -top-8 mb-1 hidden group-hover/item:block bg-primary text-secondary dark:bg-dprimary dark:text-dtertiary text-xs rounded py-1 px-2 whitespace-nowrap" translate="cancel-invitation">
								${trad['cancel-invitation']}
								</span>
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-6 pointer-events-none">
								<path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
								</svg>
						</div>
					</div>
				</div>
			</div>`;
		}

		for(const invitation of invitationReceived) {
			console.log("invitation", invitation);
			container += `
			<div id="user-${invitation.id}" class="flex flex-col justify-between w-full font-title text-xl border-2 p-2 rounded-lg border-primary dark:border-dprimary text-secondary
			bg-myblack from-primary to-secondary">

				${headerOtherUserMenu(invitation)}

				<div class="flex flex-row justify-between items-center space-x-4 mt-4">
					
					<div name="otherProfile" data-id=${invitation.id} class="flex font-title truncate hover:underline hover:cursor-pointer ">
					
					${invitation.username}
					
					</div>
					<div class="flex justify-end-safe space-x-2 items-center">
						<div id="accept-friend" data-id="${invitation.id}" data-username="${invitation.username}" 
						class="hover:cursor-pointer group/item relative ">
						<span class="tooltip absolute z-10 left-1/2 transform -translate-x-full -top-8 mb-1 hidden group-hover/item:block bg-primary text-secondary dark:bg-dprimary dark:text-dtertiary text-xs rounded py-1 px-2 whitespace-nowrap" translate="accept-invitation">
								${trad['accept-invitation']}
								</span>
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 pointer-events-none">
							<path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
							</svg>
						</div>
						<div id="refuse-invitation" data-id="${invitation.id}" data-username="${invitation.username}" class="hover:cursor-pointer group/item relative ">
							<span class="tooltip absolute z-10 left-1/2 transform -translate-x-full -top-8 mb-1 hidden group-hover/item:block bg-primary text-secondary dark:bg-dprimary dark:text-dtertiary text-xs rounded py-1 px-2 whitespace-nowrap" translate="refuse-invitation">
								${trad['refuse-invitation']}
								</span>
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 pointer-events-none">
							<path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
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

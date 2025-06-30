import { getNotifications } from '../../api/getterUser(s)';


export async function notifications() {
	
	const results = await Promise.all([
		getNotifications(),
		getNotifications("receiver")
	]);
	
	// let content: string = `<div class="flex flex-col font-title title-responsive-size items-center justify-center space-y-4 text-primary dark:text-dtertiary">`;
	
	let content = '';
	const invitationSend = results[0].data!;
	const invitationReceive = results[1].data!;
	
	if (invitationSend.length === 0 && invitationReceive.length === 0) {
		return `${content}
		<span class="text-secondary dark:text-dtertiary" translate="no-notifications">No notifications</span>`;
	}
	
	for (const invitation of invitationReceive) {
		if (invitation) {
			content += `
			<div class="flex flex-row justify-between w-full space-x-4 font-title text-xl border-2 p-2 rounded-lg">
				<div class="flex font-title">${invitation.username} wants to be your friend
				</div>
					<div id="accept-friend" data-id="${invitation.id}" data-username="${invitation.username}" 
					class="hover:cursor-pointer">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 pointer-events-none">
						<path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
						</svg>
					</div>
					<div id="refuse-invitation" data-id="${invitation.id}" data-username="${invitation.username}" class="hover:cursor-pointer">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 pointer-events-none">
						<path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
						</svg>
					</div>
			</div>`
		}
	}
	for (const invitation of invitationSend) {
	if (invitation) {
		content += `
			<div class="flex flex-row justify-between w-full items-center font-title text-xl border-2 p-2 space-x-2 rounded-lg border-primary dark:border-dprimary text-secondary">
			<div class="flex">
				<div class="flex font-title text-secondary" translate="you-sent-invitation">
					<span translate="you-sent-invitation"> You sent a friend request to </span>
				</div>
				<div class="flex ml-1.5">${invitation.username}</div>
			</div>
				<div id="cancel-invitation" data-id="${invitation.id}" data-username="${invitation.username}" class="ml-4 justify-end hover:cursor-pointer  group/item relative ">
					<span class="tooltip absolute z-10 left-1/2  top-full mb-1 hidden group-hover/item:block bg-primary text-secondary dark:bg-dprimary 
				dark:text-dtertiary text-xs rounded py-1 px-2" translate="cancel-invitation">
					Cancel this invitation
					</span>
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-6 pointer-events-none">
					<path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
					</svg>
				</div>
			</div>`
	}
}

	return `<div class="flex flex-col font-title title-responsive-size items-center justify-center space-y-4  text-tertiary dark:text-dtertiary">
			<span translate="notifications" >Notifications</span>
			<div class="flex flex-col space-y-2 font-title text-xl border-2 p-2 rounded-lg text-secondary border-primary dark:border-dprimary">
			${content}
			</div>
			</div>`
}

	// <div id="block-user" data-username=${friend.username} data-id=${friend.id} class="group/item relative hover:cursor-pointer">
	// 				<span class="tooltip absolute z-10 left-1/2  top-full mb-1 hidden group-hover/item:block bg-primary text-tertiary dark:bg-dprimary 
	// 			dark:text-dtertiary text-xs rounded py-1 px-2">
	// 				Block This MotherDucker
	// 				</span>
	// 				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 pointer-events-none">
	// 				<path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
	// 				</svg>
	// 			</div>
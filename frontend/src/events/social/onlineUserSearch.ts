import { FetchInterface } from "../../api/FetchInterface";
import { addFriendButton } from "../../pages/Friends/Lists/allUsersList";

export async function handleSearchUserGame(value: string) {
	const container = document.getElementById("search-user-list");
	if (!container) {
		return;
	}
	if (value === "") {
		container.innerHTML = "";
		return;
	}

	const searchData = await FetchInterface.getSearchUsers(value);
	if (!searchData || searchData.data!.total === 0) {
		container!.innerHTML = `<li class="font-title">No users found</li>`;
		return;
	}
	
	container.innerHTML = "";
	for (const user of searchData.data!.users) {
		container!.innerHTML += `
		<div class="flex flex-row justify-between items-center w-full space-x-2 ">
		<div class="flex justify-start items-center space-x-2">
			<img src="${user.avatar}" alt="Avatar" class="w-8 h-8 rounded-full">
			<div name="otherProfile" data-id="${user.id}" class="flex font-title text-secondary dark:text-dtertiary hover:cursor-pointer hover:underline">${user.username}</div>
		</div>
	
		<div class="flex flex-row space-x-2">

						${addFriendButton(user)}

						<div id="block-user" data-username=${user.username} data-id=${user.id} class="group/item relative hover:cursor-pointer">

							<span class="tooltip absolute z-10 left-1/2 transform -translate-x-full -top-8 mb-1 hidden group-hover/item:block bg-primary text-secondary dark:bg-dprimary dark:text-dtertiary text-xs rounded py-1 px-2 whitespace-nowrap" translate="block-motherducker">

								Block This MotherDucker
							
							</span>
						
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 pointer-events-none">
								<path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
							</svg>

						</div>
					</div>
	</div>`;
	}
}
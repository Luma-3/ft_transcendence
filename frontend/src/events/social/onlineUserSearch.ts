import { getSearchUsers } from "../../api/getterUser(s)";

export async function handleSearchUserGame(value: string) {

	const container = document.getElementById("search-user-list");
	container!.innerHTML = ""; // Clear previous results
	
	const searchData = await getSearchUsers(value);
	if (!searchData || searchData.data!.total === 0) {
		container!.innerHTML = `<li class="font-title">No users found</li>`;
		return;
	}
	
	for (const user of searchData.data!.users) {
		container!.innerHTML += `
		<div class="flex flex-row justify-between items-center w-full space-x-2 ">
		<div class="flex justify-start items-center space-x-2">
			<img src="${user.avatar}" alt="Avatar" class="w-8 h-8 rounded-full">
			<div class="flex font-title text-secondary dark:text-dsecondary">${user.username}</div>
		</div>
		<div name="otherProfile" data-id="${user.id}" class="flex p-4 items-center h-[30px] font-title rounded-lg pl-2 hover:bg-tertiary hover:text-primary hover:dark:bg-dtertiary hover:dark:text-dprimary hover:cursor-pointer">
			See Profile
		</div>
	</div>`;
	}
}
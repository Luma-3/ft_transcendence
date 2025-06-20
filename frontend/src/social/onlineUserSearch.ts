import { getSearchUsers } from "../api/getterUser(s)";

export async function handleSearchUserGame(value: string) {

	const container = document.getElementById("search-user-list");
	const searchData = await getSearchUsers(value);
	if (!searchData || searchData.data!.total === 0) {
		container!.innerHTML = `<li class="font-title">No users found</li>`;
		return;
	}
	
	container!.innerHTML = ""; // Clear previous results
	for (const user of searchData.data!.users) {
		container!.innerHTML += `<li class="flex items-center h-[30px] font-title rounded-lg pl-2
		 hover:bg-tertiary hover:text-primary hover:dark:bg-dtertiary hover:dark:text-dprimary hover:cursor-pointer">${user.username}</li>`;
	}
}
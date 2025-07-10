export function searchBar() {
return `
<div class="flex flex-col w-full justify-center items-center px-10 mt-4">

		<input type="text" id="search-user" class="w-full font-title p-2 border-2 border-zinc-300 rounded-lg dark:text-dtertiary" translate="enter-username" placeholder="enter-username"/>

		<div id="search-user-list" class="flex flex-col w-full max-h-[300px] overflow-auto p-2 space-y-2
	text-secondary dark:text-dsecondary rounded-lg">
		</div>

</div>`
};


export function searchBarGame() {
return `
<div class="flex flex-col w-full justify-center items-center px-10 mt-4">

		<input type="text" id="search-opponent" class="w-full font-title p-2 border-2 border-zinc-300 rounded-lg dark:text-dtertiary" translate="enter-username" placeholder="enter-username"/>

		<div id="search-opponent-list" class="flex flex-col w-full max-h-[300px] overflow-auto p-2 space-y-2
	text-secondary dark:text-dsecondary rounded-lg">
		</div>

</div>`
};

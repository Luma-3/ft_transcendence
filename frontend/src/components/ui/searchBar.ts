export function searchBar(id:string = "search-user", placeholder: string = "enter-username") {
return `
<div class="flex flex-col w-full justify-center items-center px-10 mt-4">

		<input type="text" id="${id}" class="w-full font-title p-2 border-2 border-zinc-300 rounded-lg dark:text-dtertiary" translate=${placeholder} placeholder="${placeholder}"/>

		<div id="${id}-list" class="flex flex-col w-full max-h-[300px] overflow-auto p-2 space-y-2
	text-secondary dark:text-dsecondary rounded-lg">
		</div>

</div>`
};

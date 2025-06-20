export function gameUserStat() {
	return `<div class="flex flex-col w-full h-full max-h-[300px] max-w-[1000px] mx-4 overflow-auto
		p-4 space-y-4 rounded-lg
		transition-transform duration-300 ease-in-out">
		
		
		<div class="flex flex-col font-title justify-between items-center w-full h-full p-4 space-x-4 bg-primary dark:bg-dprimary rounded-lg">
		
		Your game stats
		
		<ul class="flex flex-col lg:grid lg:grid-cols-1 gap-2 text-sm w-full space-y-4 space-x-4">
		<li class="flex font-title justify-between items-center w-full h-full p-4 space-x-4 bg-zinc-200 rounded-lg">
		Jean-Michmich - You
		</li>
		<li class="flex font-title justify-between items-center w-full h-full p-4 space-x-4 bg-zinc-200 rounded-lg">
		Jean-Michmich - You
		</li>
		<li class="flex col-span-1 font-title justify-between items-center w-full h-full p-4 space-x-4 bg-zinc-200 rounded-lg">
		Jean-Michmich - You
		</li>
		</ul>
		</div>
	</div>
	`;
}

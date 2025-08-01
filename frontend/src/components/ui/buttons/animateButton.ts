export function animateButton(id: string, message: string, messageHover: string) {
	return `
<div class="flex justify-center">
	<button id="${id}" class="font-title h-[50px] md:h-[70px] w-[160px] md:w-[240px] lg:w-[440px] group p-7 cursor-pointer relative title-responsive-size	
		border-0 flex items-center rounded justify-center bg-transparent
				text-tertiary dark:text-dtertiary overflow-hidden transition-all duration-100">

		<span id="${id}" class="group-hover:w-full absolute left-0 h-full w-5 border-y-4 border-l-4
			dark:border-dprimary border-primary
				rounded transition-all duration-500"></span>

		<p id="${id}" class="group-hover:opacity-0 group-hover:translate-x-[-100%] absolute translate-x-0 transition-all
				duration-200" translate="${message}">
				${message}
		</p>

		<span id="${id}" class="group-hover:translate-x-0 group-hover:opacity-100 absolute translate-x-full
			opacity-0 transition-all duration-200" translate="${messageHover}">
		
			${messageHover}
		
		</span>
		
		<span id="${id}" class="group-hover:w-1/2 absolute right-0 h-full w-5 
			border-y-4 border-r-4
				border-secondary dark:border-dsecondary 
				transition-all duration-500">
		</span>
	</button>
</div>`;
}


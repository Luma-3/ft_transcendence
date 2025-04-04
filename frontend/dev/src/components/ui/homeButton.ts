// <div class="flex items-center justify-center">
// 	<button id="loadLogin" class="animate-bounce h-1/2 w-1/2 rounded bg-primary px-4 py-2 font-bold text-white hover:bg-tertiary">
// 		<img src='images/duck.png' class="invert flex w-1/4 py-2 pointer-events-none" alt='Transcenduck Logo' />
// 	</button>
// </div>
export function homeButton() {
	return `
		<div class="flex justify-center">
		  <button class="mt-2 group p-5 cursor-pointer relative text-xl font-title 
		  border-0 flex items-center rounded justify-center bg-transparent text-tertiary 
		  h-auto w-[170px] overflow-hidden transition-all duration-100">
			<span class="
				 group-hover:w-full
				 absolute 
				 left-0 
				 h-full 
				 w-5 
				 border-y-4
				 border-l-4
				 border-primary
				 rounded
				 transition-all
				 duration-500">
			</span>
			<p id="loadLogin" class="group-hover:opacity-0 group-hover:translate-x-[-100%] absolute translate-x-0 transition-all
				 duration-200" translate="welcome">	Welcome </p>
			<span id="loadLogin" class="
				group-hover:translate-x-0 
				group-hover:opacity-100 absolute 
				translate-x-full opacity-0 transition-all duration-200" translate="get_started">
			Get Started !
			</span>
			<span id="loadLogin"  class="group-hover:w-1/2 absolute right-0 h-full w-5 
			border-y-4 border-r-4 border-secondary transition-all duration-500">
			</span>
		  </button>
		</div>
	`;


}


export function backButton() {
	return `
	<div id="loadBackPage" class="flex flex-col mt-2 sticky-top items-left text-primary dark:text-dtertiary justify-start
	w-50 p-2 lg:ml-30 md:ml-10 sm:ml-10 ml-5 transform transition-transform duration-300
	hover:-translate-x-1 hover:scale-110">
		<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor"
			class="size-12 pointer-events-none">
  			<path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
		</svg>
	</div>`
}

export function backButtonPublicPage(actualPage: string) {

	const publicPage = ["home", "login", "register"];
	const backPage = publicPage[publicPage.indexOf(actualPage) - 1] || "Home";
	return `
	<div id="load${backPage}" class="flex flex-col mt-2 sticky-top items-left text-primary dark:text-dtertiary justify-start
	w-50 p-2 lg:ml-30 md:ml-10 sm:ml-10 ml-5 transform transition-transform duration-300
	hover:-translate-x-1 hover:scale-110">
		<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor"
			class="size-12 pointer-events-none">
  			<path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
		</svg>
	</div>`
}
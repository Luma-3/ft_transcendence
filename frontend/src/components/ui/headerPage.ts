import { backButton, backButtonPublicPage } from "./buttons/backButton";

// ! Icons for the header page
////////////////////////////////////////////////////////////////////////////

const profileIcon: string = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
	class="icon-responsive-size mr-2 hover:animate-spin">
	<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
	</svg>`;

const settingsIcon: string = `
<img src="/images/duckSettings.png" alt="settingsIcon" class="flex h-40 w-40 icon-responsive-size" />`;

///////////////////////////////////////////////////////////////////

export function headerPage(titlePage: string, typePage: string = "private") {
	
	let logoSvg: string = "";
	let logo: string = "";

	switch (titlePage) {
		case "profile":
			logoSvg = profileIcon;
			break;
		case "settings":
			logoSvg = settingsIcon;
			break;
		default:
			logoSvg = "";
			break;
	}
	if (logoSvg !== "") {
		logo = `<div class="flex flex-col w-full items-center justify-center space-y-4 pt-5
		text-primary dark:text-dprimary" alt="logoPage">
			${logoSvg}
	</div>`;
	}
	const back = typePage === "public" ? backButtonPublicPage(titlePage) : backButton();
	
	return `
		${back}
		${logo}
		<div class="flex header-responsive-size p-7 font-title items-center justify-center
		text-tertiary dark:text-dtertiary overflow truncate"
		translate="${titlePage}">
		${titlePage}
		</div>`;
}
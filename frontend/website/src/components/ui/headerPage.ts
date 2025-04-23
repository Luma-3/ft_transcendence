import { backButton } from "./backButton";

// ! Icons for the header page
////////////////////////////////////////////////////////////////////////////

const profileIcon: string = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
	class="size-20 mr-2 hover:animate-spin">
	<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
	</svg>`;

const settingsIcon: string = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-20 mr-2 hover:animate-spin">
				<path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
				<path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
			</svg>`;

///////////////////////////////////////////////////////////////////

export function headerPage(titlePage: string) {
	
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
	
	return `
		${backButton()}
		${logo}
		<div class="flex text-6xl p-7 font-title items-center justify-center
		text-primary dark:text-dtertiary motion-reduce:animate-pulse overflow truncate"
		translate="${titlePage}">
			${titlePage}
		</div>`;
}
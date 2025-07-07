import { backButton, backButtonPublicPage } from "./buttons/backButton";

// ! Icons for the header page

const settingsIcon: string = `
<img src="/images/duckSettings.png" alt="settingsIcon" class="flex h-50 w-50 icon-responsive-size" />`;

const emailIcon: string = `
<img src="/images/duckEmail.png" alt="settingsIcon" class="flex h-50 w-50 icon-responsive-size" />`;


export function headerPage(titlePage: string, typePage: string = "private") {
	
	let logoSvg: string = "";
	let logo: string = "";

	switch (titlePage) {
		case "settings":
			logoSvg = settingsIcon;
			break;
		case "verify-email":
			logoSvg = emailIcon;
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
	<div class="flex flex-col w-full justify-center items-left">
		${back}
	</div>
		${logo}
		<div class="flex header-responsive-size p-7 font-title items-center justify-center
		text-tertiary dark:text-dtertiary overflow truncate"
		translate="${titlePage}">
		${titlePage}
		</div>`;
}
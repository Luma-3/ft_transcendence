import { backButton, backButtonPublicPage } from "./buttons/backButton";

const logosSvg: { [key: string]: string } = {
	"settings": `<img src="/images/duckSettings.png" alt="settingsIcon" class="flex h-70 w-70 icon-responsive-size" />`,
	"verify-email": `<img src="/images/duckEmail.png" alt="emailIcon" class="flex h-70 w-70 icon-responsive-size" />`,
	"2fa-auth": `<img src="/images/duck2FA.png" alt="twoFaIcon" class="flex h-70 w-70 icon-responsive-size" />`,
	"rgpd": `<img src="/images/duckRGPD.png" alt="rgpdIcon" class="flex h-70 w-70 icon-responsive-size" />`,
};

export function headerPage(titlePage: string, typePage: string = "private") {
	
	let logoSvg: string = "";
	let logo: string = "";

	logoSvg = logosSvg[titlePage] || "";
	if (logoSvg !== "") {
		logo = `<div class="flex flex-col w-full items-center justify-center space-y-4 pt-5
		text-primary dark:text-dprimary" alt="logoPage">
			${logoSvg}
		</div>`;
	}
	const backArrow = typePage === "public" ? backButtonPublicPage(titlePage) : backButton();
	
return `
<div class="flex flex-col w-full justify-center items-left">
	${backArrow}
</div>

${logo}

<div class="flex header-responsive-size p-7 font-title items-center justify-center text-tertiary dark:text-dtertiary overflow truncate" translate="${titlePage}">
${titlePage}
</div>`;
}
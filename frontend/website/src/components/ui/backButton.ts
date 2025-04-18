import { secondaryButton } from "./secondaryButton.ts";

export function backButton() {
	return `
	${secondaryButton({
		id: "loadBackPage",
		weight: "1/2",
		text: "Back",
		translate: "back-link",
	})}`;
}
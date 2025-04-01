import { renderSecondaryButton } from "./secondary-button.ts";

export function BackButton() {
	return `
	${renderSecondaryButton({
		id: "loadBackPage",
		weight: "1/2",
		text: "Back",
		translate: "back-link",
	})}
	`;
}
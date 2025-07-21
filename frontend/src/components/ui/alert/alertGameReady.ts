import Swal from 'sweetalert2';

import { getCustomAlertTheme } from "./alertTheme";
import { loadTranslation } from "../../../controllers/Translate";

export async function alertGameReady() {
	const customTheme = await getCustomAlertTheme(true);
	if (!customTheme) {
		return;
	}

	const trad = await loadTranslation(customTheme.lang);
	const title = trad["connecting-game"];
	const text = trad["please-wait-second"];
	let timerInterval: number;

	Swal.fire({
		title: title,
		background: customTheme.bg,
		color: customTheme.text,
		icon: "info",
		iconColor: customTheme.icon,
		html: `${text}`,
		timer: 3000,
		position: 'center-top',
		timerProgressBar: true,
		didOpen: () => {
			Swal.showLoading();
			const timer = Swal.getPopup()!.querySelector("b");
			timerInterval = setInterval(() => {
				if (timer) {
					timer!.textContent = `${(Swal.getTimerLeft()! / 1000).toFixed(0)}`;
				}
			}, 100);
		},
		willClose: () => {
			clearInterval(timerInterval);
		}
	}).then((result: { isConfirmed: boolean }) => {
		return result.isConfirmed;
	})
}


// export async function alertWithTimer(title: string, message: string, timer: number = 3000) {

// 	const customTheme = await getCustomAlertTheme(true);
// 	if (!customTheme) {
// 		return;
// 	}

// 	const trad = await loadTranslation(customTheme.lang);
// 	const headerMessage = trad[title] || title;
// 	const text = trad[message] || message;
// 	let timerInterval: number;

// 	Swal.fire({
// 		title: headerMessage,
// 		background: customTheme.bg,
// 		color: customTheme.text,
// 		icon: "info",
// 		iconColor: customTheme.icon,
// 		html: `${text}`,
// 		timer: timer,
// 		timerProgressBar: true,
// 		didOpen: () => {
// 			Swal.showLoading();
// 			const timer = Swal.getPopup()!.querySelector("b");
// 			timerInterval = setInterval(() => {
// 				timer!.textContent = `${(Swal.getTimerLeft()! / 1000).toFixed(0)}`;
// 			}, 100);
// 		},
// 		willClose: () => {
// 			clearInterval(timerInterval);
// 		}
// 	}).then((result: { isConfirmed: boolean }) => {
// 		return result.isConfirmed;
// 	})
// }
import { getCustomAlertTheme } from "../alert/alertTheme";
import { alertTemporary } from "../alert/alertTemporary";
import Swal from 'sweetalert2';

import { loadTranslation } from "../../../i18n/Translate";

export async function alertGameReady() {
	const customTheme = await getCustomAlertTheme(true);
	if (!customTheme) {
		alertTemporary("error", "Error while getting user alert theme", 'dark');
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
	timerProgressBar: true,
	didOpen: () => {
		Swal.showLoading();
		const timer = Swal.getPopup().querySelector("b");
		timerInterval = setInterval(() => {
		timer.textContent = `${(Swal.getTimerLeft() / 1000).toFixed(0)}`; 
		}, 100);
	},
	willClose: () => {
		clearInterval(timerInterval);
	}
	}).then((result) => {
	/* Read more about handling dismissals below */
	if (result.dismiss === Swal.DismissReason.timer) {
		console.log("I was closed by the timer");
	}
})}
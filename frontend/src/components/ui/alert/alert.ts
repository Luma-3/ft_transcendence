import Swal from "sweetalert2";

import { loadTranslation } from "../../../controllers/Translate";
import { getCustomAlertTheme } from "./alertTheme";

export async function alert(level: string, reason: string, needUser: boolean = false) {
	const customTheme = await getCustomAlertTheme(needUser);
	if (customTheme === undefined) {
		return;
	}

	const trad = await loadTranslation(customTheme.lang);
	const trad_message = trad[reason] || reason;

	let result = { isConfirmed: false };
	switch (level) {
		case 'error':
			result = await Swal.fire({
				icon: 'error',
				iconColor: customTheme.icon,
				title: trad_message,
				color: customTheme.text,
				background: customTheme.bg,
				showConfirmButton: false
			});
			break;
		case 'warning':
			result = await Swal.fire({
				icon: 'warning',
				iconColor: customTheme.icon,
				title: trad_message,
				color: customTheme.text,
				background: customTheme.bg,
				showConfirmButton: true,
				showCancelButton: true,
				confirmButtonColor: customTheme.confirmButtonColor,
				cancelButtonColor: customTheme.cancelButtonColor,
				confirmButtonText: trad['yes'],
				cancelButtonText: trad['cancel'],
				position: 'center',
				toast: true,
			});
			break;
	}
	return result.isConfirmed;
}

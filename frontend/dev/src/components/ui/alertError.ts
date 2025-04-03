import { loadTranslation } from "../../i18n/Translate";
import Swal from "sweetalert2";

export async function alertError(reason: string) {
	const lang = localStorage.getItem('lang') || sessionStorage.getItem('lang') || 'en';
	const trad = await loadTranslation(lang);

	const trad_message = trad[reason] || reason;
	Swal.fire({
		icon: 'error',
		iconColor: '#FF8904',
		title: trad_message,
		color: '#F8E9E9',
		background: '#744FAC',
		showConfirmButton: false
	});
}
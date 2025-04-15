import { loadTranslation } from "../../i18n/Translate";
import Swal from "sweetalert2";

export async function alertErrorWithVerif(reason: string) {

	const lang = localStorage.getItem('lang') || sessionStorage.getItem('lang') || 'en';
	const trad = await loadTranslation(lang);

	const trad_message = trad[reason] || reason;
	Swal.fire({
		icon: 'warning',
		iconColor: '#FF8904',
		title: trad_message,
		color: '#F8E9E9',
		background: '#744FAC',
		showConfirmButton: true,
		showCancelButton: true,
		confirmButtonText: trad['yes'],
		cancelButtonText: trad['cancel'],
	}).then((result) => {
		if (result.isConfirmed) {
			return true;
		}
	});

	return false;
}
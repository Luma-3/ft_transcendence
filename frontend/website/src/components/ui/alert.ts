import { loadTranslation } from "../../i18n/Translate";
import Swal from "sweetalert2";

export async function alert(reason: string, level: string) {
	const lang = localStorage.getItem('lang') || sessionStorage.getItem('lang') || 'en';
	const trad = await loadTranslation(lang);
	const trad_message = trad[reason] || reason;
	
	const theme = localStorage.getItem('theme') || 'dark';
	const bg = theme === 'dark' ? '#000000' : '#FFFFFF';
	const text = theme === 'dark' ? '#F8E9E9' : '#000000';
	const icon = theme === 'dark' ? '#FF8904' : '#137B80';
	const confirmButtonColor = theme === 'dark' ? '#744FAC' : '#137B80';
	const cancelButtonColor = theme === 'dark' ? '#FF8904' : '#000000';

	let result = {isConfirmed: false};
	switch (level) {
		case 'error':
				result = await Swal.fire({
						icon: 'error',
						iconColor: icon,
						title: trad_message,
						color: text,
						background: bg,
						showConfirmButton: false});
			break;
		case 'warning':
			result = await Swal.fire({
					icon: 'warning',
					iconColor: icon,
					title: trad_message,
					color: text,
					background: bg,
					showConfirmButton: true,
					showCancelButton: true,
					confirmButtonColor: confirmButtonColor,
					cancelButtonColor: cancelButtonColor,
					confirmButtonText: trad['yes'],
					cancelButtonText: trad['cancel'],
					position: 'top',
					toast: true,
				});
			break;
	}
	return result.isConfirmed;
}
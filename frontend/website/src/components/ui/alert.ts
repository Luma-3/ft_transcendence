import { loadTranslation } from "../../i18n/Translate";
import Swal from "sweetalert2";

export async function alert(reason: string, level: string) {
		const userInfo = await getUserInfo();
		if (userInfo.status === "error" || !userInfo.data) {
			alertTemporary("error", "Error while fetching user info", 'dark');
			return;
		}
	const lang = userInfo.data.lang;
	const theme = userInfo.data.theme;
	
	const trad = await loadTranslation(lang);
	const trad_message = trad[reason] || reason;
	console.log(theme)
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

import { fetchApi } from "../../api/fetch";
import { API_ROUTES } from "../../api/routes";
import { getUserInfo } from "../../api/getter";

export async function alertChangePasword() {
	
	const userInfo = await getUserInfo();
	if (userInfo.status === "error" || !userInfo.data) {
		alertTemporary("error","Error while fetching user info", 'dark');
		return;
	}
	
	// const userInfos = responseApiUser.data;
	const theme = userInfo.data.theme;
	const lang = userInfo.data.lang;
	const trad = await loadTranslation(lang);
	
	const bg = theme === 'dark' ? '#000000' : '#FFFFFF';
	const text = theme === 'dark' ? '#F8E9E9' : '#744FAC';
	const icon = theme === 'dark' ? '#FF8904' : '#744FAC';
	const confirmButtonColor = theme === 'dark' ? '#744FAC' : '#744FAC';
	const cancelButtonColor = theme === 'dark' ? '#FF8904' : '#000000';

	Swal.fire({
		title: trad["change-your-password"],
		position: "center",
		icon: "info",
		background: bg,
		color: text,
		iconColor: icon,
		confirmButtonColor: confirmButtonColor,
		confirmButtonAriaLabel: trad['confirm'],
		cancelButtonAriaLabel: trad['cancel'],
		cancelButtonColor: cancelButtonColor,
		
		html: `
		<div class="flex text-sm justify-center items-center font-title m-4 mt-0 ">
		${trad['change-your-password-description']}
		</div>
		<div class="flex flex-col bg-primary dark:bg-dprimary text-tertiary dark:text-dtertiary p-4 m-4 rounded-lg">
			<label for="oldPassword" class="swal2-label font-title">${trad['old-password']}</label>
			<input id="oldPassword" class="swal2-input font-title" autocapitalize="off" type="password">
			<label for="newPassword" class="swal2-label font-title mt-4">${trad['new-password']}</label>
			<input id="newPassword" type="password" class="swal2-input font-title" autocapitalize="off">
			<label for="confirmPassword" class="swal2-label font-title mt-4">${trad['confirm-new-password']}</label>
			<input id="confirmPassword" type="password" class="swal2-input font-title" autocapitalize="off">
		</div>
		`,
		showCancelButton: true,
		confirmButtonText: "Confirm",
		showLoaderOnConfirm: true,
	
		preConfirm: () => {
			const oldPassword = (document.getElementById('oldPassword') as HTMLInputElement).value;
			const newPassword = (document.getElementById('newPassword') as HTMLInputElement).value;
			const repeatNewPassword = (document.getElementById('confirmPassword') as HTMLInputElement).value;
			if (!oldPassword || !newPassword || !repeatNewPassword) {
				Swal.showValidationMessage('Please enter all fields');
			} else if (newPassword !== repeatNewPassword) {
				Swal.showValidationMessage('New password and confirm password do not match');
			}
			return { oldPassword, newPassword };
			// TODO: Rajoute un fetch pour verifier le old password et verifier si le nouveau password correspond a notre police
		}
	}).then(async (result) => {
		if (result.isConfirmed) {
			const response = await fetchApi(API_ROUTES.USERS.UPDATE_PASSWD, {
				method: "PUT",
				body: JSON.stringify({
					oldPassword: result.value?.oldPassword,
					newPassword: result.value?.newPassword,
				}),
			});
			if (response.status === "success") {
				alertTemporary("success", trad['password-changed'], theme);
			} else {
				alertTemporary("error", trad['error-while-changing-password'], theme);
			}
		}
	});
}

export async function alertTemporary(level: string, message: string, theme: string) {
	const bg = theme === 'dark' ? '#000000' : '#FFFFFF';
	const text = theme === 'dark' ? '#F8E9E9' : '#000000';
	const iconColor = theme === 'dark' ? '#FF8904' : '#137B80';
	const icon = level === 'error' ? 'error' : 'success';

	return Swal.fire({
		position: "center-end",
		toast: true,
		icon: icon,
		iconColor: iconColor,
		background: bg,
		color: text,
		title: message,
		showConfirmButton: false,
		timer: 1500
		});
}
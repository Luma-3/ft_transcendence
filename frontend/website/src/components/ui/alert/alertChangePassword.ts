import Swal from "sweetalert2";
import { fetchApi } from "../../../api/fetch";
import { API_USER } from "../../../api/routes";
import { alertTemporary } from "./alertTemporary";
import { getCustomAlertTheme } from "./alertTheme";
import { loadTranslation } from "../../../i18n/Translate";
import { verifRegexNewPassword } from "../../utils/regex";

export async function alertChangePassword() {
	
	const customTheme = await getCustomAlertTheme();
	if (!customTheme) {
		alertTemporary("error", "Error while getting user theme", 'dark');
		return;
	}
	const trad = await loadTranslation(customTheme.lang);
	let messageError = "";
	Swal.fire({
		title: trad["change-your-password"],
		position: "center",
		icon: "info",
		background: customTheme.bg,
		color: customTheme.text,
		iconColor: customTheme.icon,
		confirmButtonColor: customTheme.confirmButtonColor,
		confirmButtonAriaLabel: trad['confirm'],
		cancelButtonAriaLabel: trad['cancel'],
		cancelButtonColor: customTheme.cancelButtonColor,
		
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
				messageError = trad['please-enter-all-fields'];
				Swal.showValidationMessage(messageError);
			} else if (newPassword !== repeatNewPassword) {
				messageError = trad['new-password-and-confirm-password-are-different'];
				Swal.showValidationMessage(messageError);
			} else if(verifRegexNewPassword(newPassword) === false) {
				messageError = trad['password-must-include'];
				Swal.showValidationMessage(messageError);
			}
			return { oldPassword, newPassword };
		}
	}).then(async (result) => {
		if (result.isConfirmed) {
			const response = await fetchApi(API_USER.UPDATE.PASSWORD, {
				method: "PATCH",
				body: JSON.stringify({
					oldPassword: result.value?.oldPassword,
					password: result.value?.newPassword,
				}),
			});
			if (response.status === "success") {
				alertTemporary("success", trad['password-changed'], customTheme.theme);
			} else {
				alertTemporary("error", trad['error-while-changing-password'], customTheme.theme);
			}
		}
	});
}
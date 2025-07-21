import Swal from "sweetalert2";

import { getCustomAlertTheme } from "./alertTheme";
import { loadTranslation } from "../../../controllers/Translate";
import { verifRegexNewPassword } from "../../utils/regex";
import { FetchInterface } from "../../../api/FetchInterface";

export async function alertChangePassword() {

	const customTheme = await getCustomAlertTheme();
	if (!customTheme) {
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
		confirmButtonText: trad['confirm'],
		cancelButtonText: trad['cancel'],
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
		showLoaderOnConfirm: true,

		preConfirm: () => {
			const oldPassword = (document.getElementById('oldPassword') as HTMLInputElement).value;
			const newPassword = (document.getElementById('newPassword') as HTMLInputElement).value;
			const repeatNewPassword = (document.getElementById('confirmPassword') as HTMLInputElement).value;
			if (!newPassword || !repeatNewPassword) {
				messageError = trad['please-enter-all-fields'];
				Swal.showValidationMessage(messageError);
			} else if (newPassword !== repeatNewPassword) {
				messageError = trad['new-password-and-confirm-password-are-different'];
				Swal.showValidationMessage(messageError);
			} else if (verifRegexNewPassword(newPassword) === false) {
				messageError = trad['password-must-include'];
				Swal.showValidationMessage(messageError);
			} else if (oldPassword === newPassword) {
				messageError = trad['new-password-must-be-different-from-old-password'];
				Swal.showValidationMessage(messageError);
			}
			return { oldPassword, newPassword };
		}
	}).then(async (result: { isConfirmed: boolean; value: { oldPassword: string; newPassword: string } }) => {
		if (result.isConfirmed) {
			await FetchInterface.updatePassword(result.value.oldPassword, result.value.newPassword);
		}
	});
}
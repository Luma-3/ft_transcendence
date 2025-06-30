import { alertTemporary } from "../../components/ui/alert/alertTemporary";
import { getCustomAlertTheme } from "../../components/ui/alert/alertTheme";
import { loadTranslation } from "../../controllers/Translate";
import Swal from "sweetalert2";

export async function showNotificationDiv() {

		const customTheme = await getCustomAlertTheme();
		if (!customTheme) {
			alertTemporary("error", "Error while getting user theme", 'dark');
			return;
		}
		const trad = await loadTranslation(customTheme.lang);
		let messageError = "";
		Swal.fire({
			title: "notifications",
			position: "center",
			icon: "info",
			background: customTheme.bg,
			color: customTheme.text,
			iconColor: customTheme.icon,
			cancelButtonAriaLabel: trad['cancel'],
			cancelButtonColor: customTheme.cancelButtonColor,
			
			html: `
			<div id="notification-content" class="flex text-responsive-size justify-center items-center font-title m-4 mt-0 ">

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
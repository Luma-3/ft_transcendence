import { UserInfo } from '../../interfaces/User';
import { form } from '../../components/ui/form/form';

export function userUpdateForm(user: UserInfo) {
	return `
		${form({
		name : "saveChangeBasicUserInfo",
		inputs: [
			{
				name: "username",
				type: "text",
				labelClass: "font-title text-tertiary dark:text-dtertiary",
				value: user.username,
				autocomplete: "off",
				required: true,
				translate: "username",
			},
			{
				name: "email",
				type: "email",
				labelClass: "font-title text-tertiary dark:text-dtertiary",
				placeholder: user.email,
				value: user.email,
				autocomplete: "off",
				required: true,
				translate: "email",
			},
		],
		button: {
			id: "changeUserInfo",
			text: "Save changes",
			weight: "1/2",
			translate: "save-changes",
			type: "submit",
		},
		button2: {
			id: "change-password",
			text: "Change password",
			weight: "1/2",
			translate: "change-password",
		type: "button"
		},
	})}`
}
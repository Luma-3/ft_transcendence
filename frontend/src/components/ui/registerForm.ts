import { form } from "./form";

export function registerForm() {
	return `
	${form({
		name : "registerForm",
		inputs: [
			{
				name: "username",
				type: "text",
				placeholder: "username",
				autocomplete: "username",
				required: true,
				translate: "username",
			},
			{
				name: "password",
				type: "password",
				placeholder: "Password",
				autocomplete: "current-password",
				required: true,
				translate: "password",
			},
			{
				name: "passwordVerif",
				type: "password",
				placeholder: "Verify Password",
				autocomplete: "current-password",
				required: true,
				translate: "verif_password",
			},
		],
		button: {
			id: "registerButton",
			text: "Register",
			translate: "register",
			type: "submit",
		},
		
	})}`;
}
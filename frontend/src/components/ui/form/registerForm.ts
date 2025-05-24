import { form } from "./form";

export function registerForm() {
	return `<div class="flex flex-col items-center justify-center">
	${form({
		name : "registerForm",
		inputs: [
			{
				name: "username",
				type: "text",
				placeholder: "Username",
				autocomplete: "username",
				required: true,
				translate: "username",
			},
			{
				name: "email",
				type: "email",
				placeholder: "Email",
				autocomplete: "email",
				required: true,
				translate: "email",
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
				translate: "verif-password",
			},
		],
		button: {
			id: "registerButton",
			text: "Register",
			translate: "register",
			type: "submit",
		},
		
	})}
	</div>`;
}
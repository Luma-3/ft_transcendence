import { form } from "./form";

export function loginForm() {
	return `<div class="flex flex-col items-center justify-center">
	${form({
		name: "LoginForm",
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
		],
		button: {
			id: "loginForm",
			text: "Login",
			translate: "login",
			type: "submit",
		},
	})}
	</div>`;
}
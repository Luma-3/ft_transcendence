import { loginForm } from "../components/ui/form/loginForm";
import { messageWithLink } from "../components/ui/messageWithLink";
import { primaryButton } from "../components/ui/buttons/primaryButton";
import { headerPage } from "../components/ui/headerPage";

export function renderLoginPage() {
  return `
		<div class="flex flex-col font-title text-responsive-size dark:text-dtertiary justify-center h-screen text-center">
		${headerPage("login", "public")}
		${loginForm()}
		<span> or </span>
			<div class="flex flex-row items-center justify-center mt-4">
				${primaryButton({ id: "google", text: "Google", weight: "1/2", translate: "google-login", type: "button" })}
			</div>
		${messageWithLink("no-account", "register", "loadregister")}
		</div>`;
}

export default function loginPage() {
  return renderLoginPage();
}

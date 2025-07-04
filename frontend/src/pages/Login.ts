import { loginForm } from "../components/ui/form/loginForm";
import { messageWithLink } from "../components/ui/messageWithLink";
import { headerPage } from "../components/ui/headerPage";

export function renderLoginPage() {
return `
<div class="flex flex-col font-title text-responsive-size dark:text-dtertiary justify-center  text-center mt-40">

	${headerPage("login", "public")}
	${loginForm()}

	${messageWithLink("no-account", "register", "loadregister")}

</div>`;
}

export default function loginPage() {
  return renderLoginPage();
}

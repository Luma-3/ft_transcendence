import { loginForm } from "../components/ui/form/loginForm";
import { messageWithLink } from "../components/ui/messageWithLink";
import { primaryButton } from "../components/ui/buttons/primaryButton";
import { headerPage } from "../components/ui/headerPage";
import { animateButton } from "../components/ui/buttons/animateButton";

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

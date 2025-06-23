import { animateButton } from "../components/ui/buttons/animateButton"
import { primaryButton } from "../components/ui/buttons/primaryButton"
import { headerPage } from "../components/ui/headerPage"

export default async function verifyEmail() {
return `
<div class="flex flex-col w-full h-full rounded-lg justify-center mt-30">
	
	${headerPage("verify-email", "public")}
	
	<div class="flex flex-col w-full h-full rounded-lg justify-center items-center mt-5 mb-10">
		
		<div class="flex font-title text-responsive-size justify-center w-1/2 items-center text-tertiary dark:text-dtertiary">
			
			<span translate="you-have-to-verify-email"> Merci ! Nous vous avons envoyé un e-mail. Il vous suffit de cliquer sur le lien pour vérifier votre adresse.</span>
		
		</div>
	</div>
	
	<div class="flex flex-col w-full justify-center items-center mb-80 space-y-10">

		${animateButton("sendEmail", "Too late ? Not receive ?", "Resend-Email")}
		
		${primaryButton({id: "loaddashboard",weight: "1/2", text:"Fuck verify, let's go to dashboard" })}
	
	</div>
</div>`
}

//449

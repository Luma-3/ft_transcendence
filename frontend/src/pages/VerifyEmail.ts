import { headerPage } from "../components/ui/headerPage"
import { startEmailCooldown } from "../components/utils/sendEmail"
export default async function verifyEmail() {
startEmailCooldown();
return `
<div class="flex flex-col w-full h-full rounded-lg justify-center mt-5">
	
	${headerPage("verify-email", "public")}
	
	<div class="flex flex-col w-full h-full rounded-lg justify-center items-center mt-5 mb-10">
		
		<div class="flex font-title text-responsive-size justify-center w-1/2 items-center text-tertiary dark:text-dtertiary">
			
			<span translate="you-have-to-verify-email"> Merci ! Nous vous avons envoyé un e-mail. Il vous suffit de cliquer sur le lien pour vérifier votre adresse.</span>
		
		</div>

		<!-- Gros compteur de 10 minutes -->
		<div class="flex flex-col items-center mt-8 mb-6">
			<div class="text-lg font-semibold text-tertiary dark:text-dtertiary mb-2">
				<span translate="email-expires-in">Votre e-mail expire dans :</span>
			</div>
			<div id="main-timer" class="text-6xl font-bold text-primary dark:text-dprimary">
				10:00
			</div>
		</div>
	</div>

	<div class="flex flex-col w-full justify-center items-center mb-80 space-y-10">
	
		<button id="send-email" type="button" class="hidden font-title w-1/2 md:w-1/3 lg:w-1/4 h-[50px] md:h-[70px] lg:h-[80px] 
		bg-primary dark:bg-myblack text-secondary dark:text-dsecondary 
		hover:bg-secondary hover:text-primary dark:hover:bg-dsecondary dark:hover:text-dprimary 
		disabled:opacity-0 disabled:cursor-not-allowed disabled:hover:bg-primary disabled:hover:text-secondary
		dark:disabled:hover:bg-dprimary dark:disabled:hover:text-dsecondary
		rounded-lg transition-all duration-300 shadow-lg">
			<span class="pointer-events-none" translate="send-email">Renvoyer l'e-mail</span>
		</button>

		
		</div>
		</div>`
	}
	// <div id="resend-timer-container" class="flex flex-col items-center" style="display: none;">
	// 	<div class="text-sm text-gray-500 dark:text-gray-400 mb-2">
	// 		<span translate="wait-before-resend">Attendez avant de renvoyer :</span>
	// 	</div>
	// 	<div id="resend-timer" class="text-2xl font-semibold text-secondary dark:text-dsecondary">
	// 		1:00
	// 	</div>
	// </div>

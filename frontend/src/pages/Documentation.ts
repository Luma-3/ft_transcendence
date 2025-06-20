import { primaryButton } from "../components/ui/buttons/primaryButton"
import { backButton } from "../components/ui/buttons/backButton";

export default function documentation() {
  return `
	${backButton()}
	<div class="flex flex-col items-center justify-center">
	<img src="/images/duckAPI.png" alt="Duck API" class="w-70 mt-10 mb-4 drop-shadow-lg" />
	<div class="flex font-title ml-4 text-6xl mt-10 mb-10 text-tertiary dark:text-dtertiary" translate="choose-your-doc">API Doc:</div>

		<div class="flex flex-col w-full items-center justify-center">
		<div class="flex flex-row w-3/4 space-x-4 justify-center items-center">
    ${primaryButton({ id: 'showAuthDoc', text: 'auth api doc' })}
		${primaryButton({ id: 'showUserDoc', text: 'user api doc' })}
		${primaryButton({ id: 'showUploadDoc', text: 'upload api doc' })}
		${primaryButton({ id: 'showGameDoc', text: 'game api doc' })}
	</div>
	</div>
	<div class="flex justify-center items-center">
	<div id='redoc-container' class="flex ml-4 mr-4 mt-10
	 bg-white rounded-xl border-6 border-primary dark:border-dprimary mb-40"></div>
	 </div>
	`;
}
// <div class="flex p-4 items-center text-tertiary dark:text-dtertiary justify-center max-h-[1000px]">
// </div>

import { primaryButton } from "../components/ui/buttons/primaryButton"
// import { navbar } from "../components/ui/navbar";
// import { User } from "../interfaces/User";
import { backButton } from "../components/ui/buttons/backButton";

export default function documentation() {
  console.log('documentation page loaded');
  return `
	${backButton()}
	<div class="flex font-title ml-4 text-6xl mt-10 mb-10 text-tertiary dark:text-dtertiary" translate="choose-your-doc">API Doc:</div>
	
	<div class="flex flex-col space-y-7 gap-4">
		${primaryButton({ id: 'showUserDoc', text: 'user api doc' })}
		${primaryButton({ id: 'showUploadDoc', text: 'upload api doc' })}
		${primaryButton({ id: 'showGameDoc', text: 'game api doc' })}
		${primaryButton({ id: 'showPeopleDoc', text: 'people api doc' })}
    ${primaryButton({ id: 'showAuthDoc', text: 'auth api doc' })}
	</div>
	<div class="flex flex-col lg:flex-row justify-center items-center h-full">
		<div class="flex p-4 items-center text-tertiary dark:text-dtertiary justify-center max-h-[1000px]">
		</div>
	
		<div class="flex w-3/4 m-10 justify-center z-10">
			<div id='redoc-container' class="flex bg-white rounded-xl border-6 border-primary dark:border-dprimary"></div>
		</div>
	</div>
	`;
}

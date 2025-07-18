import { backButton } from "../components/ui/buttons/backButton";
import { Button } from "../classes/Button";

export default function documentation() {

	const authApi = new Button("showAuthDoc", "full", "Authentification Doc", "auth-doc", "primary", "button");
	const userApi = new Button("showUserDoc", "full", "User Doc", "user-doc", "primary", "button");
	const uploadApi = new Button("showUploadDoc", "full", "Upload Doc", "upload-doc", "primary", "button");
	const gameApi = new Button("showGameDoc", "full", "Game Doc", "game-doc", "primary", "button");

return `
${backButton()}

<div class="flex flex-col items-center justify-center">

	<img src="/images/duckAPI.png" alt="Duck API" class="w-70 mt-10 mb-4 drop-shadow-lg"/>

	<div class="flex font-title ml-4 text-6xl mt-10 mb-10 text-tertiary dark:text-dtertiary" translate="api-doc-transcenduck-services">

	API Doc:

	</div>

	<div class="flex flex-col w-full items-center justify-center mb-10">

		<div class="flex flex-row w-3/4 space-x-4 justify-center items-center">

			${authApi.primaryButton()}
			${userApi.primaryButton()}
			${uploadApi.primaryButton()}
			${gameApi.primaryButton()}

		</div>
	</div>

	<div class="flex justify-center items-center">

	<div id='redoc-container' class="hidden flex ml-4 mr-4 mt-10
	bg-white rounded-xl border-6 border-primary dark:border-dprimary mb-40">
	</div>

	</div>

</div>`;
}
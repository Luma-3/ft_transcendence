import { alertTemporary } from "../../components/ui/alert/alertTemporary";
import { headerPage } from "../../components/ui/headerPage";
import RGPD_EN from "./RGPD_en";
import RGPD_ES from "./RGPD_es";
import RGPD_FR from "./RGPD/RGPD_fr";

const files: { [key: string]: () => string } = {
	"fr": RGPD_FR,
	"en": RGPD_EN,
	"es": RGPD_ES
};

export function insertRgpdContent(language: string) {
	const destination_div = document.getElementById('rgpd-content');
	if (!destination_div) {
		alertTemporary("error", "file-not-found-reload");
		return;
	}
	destination_div.innerHTML = files[language]();
}


export default function RGPD() {
	return `
	<div class="flex flex-col w-full h-full min-h-screen">
		
		<div class="flex flex-col w-full justify-center items-center mt-4 p-12">
			${headerPage("rgpd", "private")}

				</div>
				
				<div id="rgpd-content" class="flex flex-col items-center space-y-6">
				
					<div class="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl">
						
						<button id="rgpd-fr" 
							class="group flex flex-col items-center justify-center p-8 rounded-xl 
							bg-white dark:bg-dsecondary shadow-lg hover:shadow-xl 
							transform hover:scale-105 transition-all duration-300 
							border-2 border-transparent hover:border-primary dark:hover:border-dprimary">
							
							<div class="flex items-center justify-center w-32 h-32 mb-4 rounded-full 
								bg-blue-100 dark:bg-blue-900 group-hover:bg-primary dark:group-hover:bg-dprimary pointer-events-none
								transition-all transform duration-500 ease-in-out">
								<img src="/icons/frhead.png" alt="Français" class="transition-transform duration-300" />
							</div>
							
						</button>
						
						<button id="rgpd-es"
							class="group flex flex-col items-center justify-center p-8 rounded-xl 
							bg-white dark:bg-dsecondary shadow-lg hover:shadow-xl 
							transform hover:scale-105 transition-all duration-300 
							border-2 border-transparent hover:border-primary dark:hover:border-dprimary">
							
							<div class="flex items-center justify-center w-32 h-32 mb-4 rounded-full 
								bg-red-100 dark:bg-red-900 group-hover:bg-primary dark:group-hover:bg-dprimary pointer-events-none
								transition-all transform duration-500 ease-in-out">
								<img src="/icons/eshead.png" alt="Español" class="transition-transform duration-300" />
							</div>
						</button>
						
						<button id="rgpd-en" 
							class="group flex flex-col items-center justify-center p-8 rounded-xl 
							bg-white dark:bg-dsecondary shadow-lg hover:shadow-xl 
							transform hover:scale-105 transition-all duration-300 
							border-2 border-transparent hover:border-primary dark:hover:border-dprimary">
							
							<div class="flex items-center justify-center w-32 h-32 mb-4 rounded-full 
								bg-green-100 dark:bg-green-900 group-hover:bg-primary dark:group-hover:bg-dprimary pointer-events-none
								transition-all transform duration-500 ease-in-out">
								<img src="/icons/enhead.png" alt="English" class="transition-transform duration-300" />
							</div>
						</button>
						
					</div>
				</div>
				

				
			</div>
		</div>
		
		<!-- Espacement en bas -->
		<div class="h-20"></div>
		
	</div>`;
}

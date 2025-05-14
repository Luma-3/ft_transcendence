import { secondaryButton } from './buttons/secondaryButton'

export function changeDefaultLang(langPreselect: string) {

	const all_langs = [
		"fr",
		"en",
		"es"]

	
	const labels = all_langs.map((lang) => {

		const isChecked = (lang === langPreselect) ? 'checked' : ''
		return `<div role="button" class="group/item flex w-full justify-center items-center rounded-lg p-0 transition-all
		hover:bg-tertiary hover:dark:bg-dsecondary focus:bg-slate-100 active:bg-slate-100 relative peer-checked:border-2 peer-checked:border-tertiary dark:border-dsecondary">
		
					<label for="${lang}-changer" class="flex w-full cursor-pointer justify-center items-center px-3 py-2">
					
					<img src="icons/${lang}head.png" alt="${lang}" class="max-w-[70px] rounded-full saturate-200" />
					<span class="tooltip absolute left-1/2 -translate-x-1/2 bottom-full mb-1 hidden group-hover/item:block bg-primary text-tertiary dark:bg-dprimary 
					dark:text-dtertiary text-xs rounded py-1 px-2 z-10">
                        <img src="icons/${lang}.webp" alt="${lang}" class="max-w-[20px] rounded-full saturate-200" />
                    </span>
					<input type="radio" name="lang-selector" class="absolute peer h-5 w-5 cursor-pointer transition-all
					 appearance-none"
					id="${lang}-changer" name="langSelect" ${isChecked} onchange="changeLanguage('${lang}')"/>
					</label>
					</div>`
	}).join('')
	

	return `<div class="title-responsive-size p-2 font-title items-center justify-center motion-reduce:animate-pulse" translate="change-default-language">Change default language</div>
				<div class="flex flex-col w-full max-w-[800px] rounded-xl bg-primary dark:bg-dprimary shadow">
				<nav class="flex flex-col md:flex-row  w-full gap-1 p-2">
				${labels}
				<div class="flex justify-center items-center min-w-[200px]">
				${secondaryButton({id: 'saveLang', weight: "1/2", text: 'Save', translate: 'save', type: 'button'})}
				</div>
				</div>
				</nav>`
}
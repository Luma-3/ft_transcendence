import { API_CDN } from "../../api/routes";

export function profileHeader(userPref: {avatar: string, banner: string}) {
return `
<div id="profile-header" class="flex flex-col max-w-[400px] lg:max-w-[1000px] mb-20 items-center justify-center space-y-2 pt-4">

	<div id="banner-div" class="relative w-[500px] lg:w-[1000px] h-64 editor-select ">

		<!-- ! BANNER  -->
		<div class="relative w-full h-full group" >

			<label for="banner-upload">
			<input id="banner-upload" type="" accept="image/*" class="hidden " data-type="banner" />

			<img src="${API_CDN.BANNER}/${userPref.banner ?? 'default.webp'}" alt="Banner" 
				class=" w-full h-full object-cover rounded-lg shadow-lg group-hover:blur-sm" />

			<div class="absolute inset-0 flex items-center justify-center">

				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-1/2 h-1/2 opacity-0 group-hover:opacity-100 group-hover:cursor-pointer transition-opacity duration-500 ease-in-out">

					<path stroke-linecap="round" stroke-linejoin="round" 
					d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />

				</svg>
			</div>

			</label>
		</div>
		<!--! END OF BANNER -->


		<!-- ! IMAGE  -->
		<div class="flex justify-center items-center editor-select">

			<div class="absolute left-0 flex-col items-center space-y-2 ml-15 mr-15 pt-4 justify-center">

				<label for="file-upload" class="flex">
					<input id="file-upload" type="" accept="image/*" class="hidden editor-select" data-type="avatar" />

					<div id="img-div" class="relative w-32 h-32 group text-primary dark:text-dprimary">
					
						<img src=${API_CDN.AVATAR}/${userPref.avatar} class="w-full h-full rounded-full border-6 opacity-100 group-hover:opacity-0 transition-opacity duration-300 ease-in-out" alt="Profile picture">
					
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out">

						<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />

						</svg>
					</div>
				</label>
			</div>
		<!--! END OF IMAGE --->

		</div>

	</div>

</div>
`};
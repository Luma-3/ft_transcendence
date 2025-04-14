function photoProfile() {
	return `<img src="images/pp.jpg" alt="Profile Picture" class="rounded-full w-32 h-32 border-4 border-primary dark:border-dtertiary">`
}


function renderProfileHeader() {
	return `<div class="flex flex-col-1 items-center justify-center w-full h-screen text-primary dark:text-dtertiary">
	${photoProfile()}
	${renderProfileName()}
	<div>`
}

function renderProfileName() {
	return `<h1 class="text-3xl font-title text-center mt-4" translate="profile">Profile</h1>`
}


export function profilePage() {
	return `${renderProfileHeader()}`
	;
}
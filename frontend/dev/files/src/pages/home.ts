function divHomePage() {
	return `
  <div class='flex flex-col items-center justify-center h-screen space-y-4 text-white'>
    <img src='/logo.svg' alt='Transcenduck Logo' />
    <div class='flex flex-row items-center justify-space-between'>
      <label for='language' translate="lang_choice" class="p-3 font-title">Choose a language:</label>
      <select name='language' id='language' class="hover:cursor-pointer">
        <option class="bg-black" value='en'></option>
        <option class="bg-black" value='en'>English</option>
        <option class="bg-black" value='fr'>French</option>
        <option class="bg-black" value='es'>Spanish</option>
      </select>
    </div>
    <div class='flex flex-row items-center p-3 justify-space-between'>
      <label class='text-lg p-4' for='theme' translate="save_choice">Save language</label>
      <input type='checkbox' id="save_lang" class="bg-black"/>
    </div>
    <div class="flex items-center justify-center space-x-4">
      <button id="loadLogin" class="flex w-1/3 bg-black border rounded-full justify-between items-center hover:cursor-pointer hover:bg-rose-700">
        <h1 class="justify-start p-4 text-lg"> Go to login page </h1>
        <img src='/duck.png' class="invert w-1/4 p-4 hover:cursor-pointer" alt='Transcenduck Logo' />
      </button>
    </div>
  </div>
  `
}

export function homePage() {
  const container = divHomePage();
  return container;
}
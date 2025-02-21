export function renderHomePage() {
	return `
  <div class='flex flex-col items-center justify-center h-screen space-y-4 text-white'>
    <img src='/logo.svg' alt='Transcenduck Logo' />
    <div class='flex flex-row items-center justify-space-between'>
      <label for='language' translate="lang_choice" class="p-3">Choose a language:</label>
      <select name='language' id='language' class="hover:cursor-pointer">
        <option class="bg-black" value='en'>English</option>
        <option class="bg-black" value='fr'>French</option>
        <option class="bg-black" value='es'>Spanish</option>
      </select>
    </div>
    <div class='flex flex-row items-center p-3 justify-space-between'>
      <label class='text-lg p-4' for='theme' translate="save_choice">Save language</label>
      <input type='checkbox' id="save_lang" class="appearance-none w-6 h-6 bg-black border-2 border-gray-500 rounded-md checked:bg-orange-500 hover:cursor-pointer"/>
    </div>
  <button class="overflow-hidden rounded-full">
  <img src='/duck_enter2.png' id="loadLogin" class="brightness-0 w-110 h-100 hover:brightness-100 cursor-pointer" alt='Transcenduck Logo' />
  </div>
      `
}
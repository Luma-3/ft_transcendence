import { UserInfo } from '../../interfaces/User'

export const myMessagesTemplate = `<div class="flex w-full rounded-lg justify-end items-center">
	<div class="font-title dark:bg-dprimary bg-primary text-white p-2 rounded-lg">`;

export const otherMessagesTemplate = `<div class="flex w-full rounded-lg justify-start items-center">
	<div class="font-title dark:bg-dsecondary bg-secondary text-zinc-600 p-2 rounded-lg">`;

export function renderChat(user: UserInfo) {

	//TODO: Handle tout les autres messages qui sont peut etre deja present dans le chat
	return `<div class="flex flex-col w-full h-full max-h-[600px] max-w-[400px] mx-4
		p-4 space-y-4 rounded-lg
		transition-transform duration-300 ease-in-out">
		<div class="relative top-0 flex-row font-title title-responsive-size justify-between items-center space-x-4">
		<div class="flex flex-row justify-between items-center space-x-4">
		Quack'n Talk
		<img src="/images/duckChat.png" alt="Duck Chat" class="w-20 drop-shadow-lg" />
		</div>
		</div>
		<div class="flex flex-col font-title justify-between items-center w-full h-full p-4 space-x-4 border-4 border-primary dark:border-dprimary rounded-lg">
		<div id="chat-messages" class="flex flex-col w-full h-full max-h-[300px] overflow-auto scroll-smooth p-2 space-y-2 bg-zinc-50 rounded-lg">
			<!-- Messages will be dynamically added here -->
			${otherMessagesTemplate}Welcome to the chat, ${user.username}!</div></div>
			${otherMessagesTemplate}Feel free to say hello!</div></div>
			${myMessagesTemplate}Quack quack!</div></div>

			</div>
		<div class="flex flex-row w-full space-x-4">
		<div class="flex flex-col space-y-2 w-full">
		<textarea type="text" id="chat-input" class="w-full p-1 font-title border-2 border-zinc-300 rounded-lg overflow-scroll
		focus:outline"> </textarea>
		</div>
		<button id="send-chat" class="flex items-center p-2 font-title bg-primary dark:bg-dprimary text-white rounded-lg hover:bg-primary/80 dark:hover:bg-dprimary/80" translate="send">Quack</button>
		</div>
		</div>
		`;
	}
	// <label for="chat-input" class="text-md font-title" translate="enter-message">Enter your message</label>
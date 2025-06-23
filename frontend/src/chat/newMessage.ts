import { myMessagesTemplate } from "../pages/Dashboard/Chat";

export function addNewMessage() {
	const messageInput = document.querySelector<HTMLTextAreaElement>('#chat-input');
	if (!messageInput) {
		return;
	}

	const message = myMessagesTemplate + messageInput.value + '</div></div>';
	const chatMessages = document.querySelector<HTMLDivElement>('#chat-messages');
	chatMessages?.insertAdjacentHTML('beforeend', message);
	messageInput.value = '';
	chatMessages?.scrollTo({
		top: chatMessages.scrollHeight,
		behavior: 'smooth'
	});
}
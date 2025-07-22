import ImageEditor from 'tui-image-editor';
import { alertTemporary } from '../ui/alert/alertTemporary';
import { loadTranslation } from '../../controllers/Translate';
import { dataURLToBlob } from './convertImage';
import { API_USER } from '../../api/routes';
import { fetchApi, fetchApiWithNoError } from '../../api/fetch';
import { FetchInterface } from '../../api/FetchInterface';

/**
 * Function que gere l'apparition et la disparition de l'editeur d'image
 */
function showEditor() {
	const editor = document.getElementById('hidden-main-image-editor');

	if (editor) {
		editor.classList.remove('hidden');
		void editor.offsetWidth; // Trigger reflow
		editor.classList.remove('translate-y-10', 'opacity-0', 'pointer-events-none', 'hidden');
		editor.classList.add('translate-y-0', 'opacity-100', 'pointer-events-auto');
	}
}

function hideEditor() {
	const editor = document.getElementById('hidden-main-image-editor');

	if (editor) {
		editor.classList.add('translate-y-10', 'opacity-0', 'pointer-events-none');
		editor.classList.remove('translate-y-0', 'opacity-100', 'pointer-events-auto');

		setTimeout(() => {
			editor.classList.add('hidden');
			document.getElementById("profile-header")?.classList.replace("hidden", "flex")
			for (const child of document.getElementsByClassName("editor-select") as HTMLCollectionOf<HTMLElement>) {
				child.removeAttribute('hidden'); // Enable all editor-select inputs
			}
		}, 300);
	}
}

export function cancelEditor() {
	hideEditor();
}

type TypeImageEditor = "AVATAR" | "BANNER";
let main_editor: ImageEditor | null = null;
let statusEditor: TypeImageEditor = "AVATAR"; // Default to avatar, can be changed to banner

/**
 * Function appelle lors du clique sur l'image dans le profil
 */
export async function showEditorPicture(type: TypeImageEditor = "AVATAR") {
	statusEditor = type;
	main_editor = await initImageEditor();
	if (!main_editor) {
		alertTemporary("error", "Error while initializing image editor", true);
		return;
	}
	for (const child of document.getElementsByClassName("editor-select") as HTMLCollectionOf<HTMLElement>) {
		child.setAttribute('hidden', "true"); // Disable all editor-select inputs
	}
	translateImageEditorLabel();
}


/**
 * Fonction qui permet de recuperer l'image editee et de l'envoyer
 */
export async function saveNewPicture() {
	if (!main_editor) {
		throw new Error('Image editor not initialized');
	}
	const new_image = main_editor.toDataURL({
		format: 'png'
	});
	if (new_image.length === 1594) {
		//TODO: Traduction
		return alertTemporary("error", "image-is-empty", true);
	}
	const formData = new FormData();
	formData.append('tmp', dataURLToBlob(new_image), 'tmp.png');
	const response = await fetchApiWithNoError(API_USER.UPDATE.PREF[statusEditor], {
		method: 'PATCH',
		headers: {},
		body: formData
	});
	if (response.status === "error") {
		alertTemporary("error", "image-too-big", true);
		return;
	}
	alertTemporary("success", "New picture saved successfully!", true);
	setTimeout(() => {
		window.location.reload();
	}, 1000);
}

/**
 * Initialisation et gestion du theme et des options de l'editeur d'image
 */
async function initImageEditor(): Promise<ImageEditor | null> {

	showEditor();
	document.getElementById("profile-header")?.classList.replace("flex", "hidden")

	const div_editor = document.getElementById('tui-image-editor-container') as HTMLDivElement;
	if (!div_editor) {
		return await alertTemporary("error", "Error while initializing image editor", true), null;
	}

	const user = await FetchInterface.getUserInfo();
	if (!user) {
		return await alertTemporary("error", "Error while fetching user info", true), null;
	}

	const theme = user.preferences!.theme;
	const headerColor = theme === 'dark' ? '#000000' : '#FFFFFF';
	const loadButtonColor = theme === 'dark' ? '#FF8904' : '#44BBA4';
	const backgroundColor = theme === 'dark' ? '#000000' : '#FFFFFF';
	const loadButtonfontFamily = "Chillax";

	div_editor.innerHTML = '';
	const editor = new ImageEditor(div_editor, {
		includeUI: {
			loadImage: {
				path: '',
				name: '',
			},
			theme: {
				'header.backgroundColor': headerColor,
				'loadButton.fontFamily': loadButtonfontFamily,
				'loadButton.backgroundColor': loadButtonColor,
				'common.backgroundColor': backgroundColor,
				'submenu.backgroundColor': headerColor,
			},
			menu: [
				'crop',
				'flip',
				'rotate',
				'draw',
				'shape',
				'text',
				'icon',
				'mask',
			],
			//   initMenu: 'crop',
			menuBarPosition: 'bottom',
			uiSize: {
				width: '80%',
				height: '100%',
			},
		},
		cssMaxWidth: 700,
		cssMaxHeight: 800,
		selectionStyle: {
			cornerSize: 20,
			rotatingPointOffset: 70,
		},
		usageStatistics: false,
	});
	return editor;
}

async function translateImageEditorLabel() {
	const userPrefs = await FetchInterface.getUserPrefs();
	if (!userPrefs) {
		return await alertTemporary("error", "Error while fetching user info", false);
	}
	const lang = userPrefs.lang;
	if (lang === "en") {
		return;
	}

	const main_container = document.querySelector<HTMLDivElement>('#tui-image-editor-container')!;
	const elements = main_container.querySelectorAll('label');

	const trad = await loadTranslation(lang);
	/**
	 * Traduction du bouton Load situe en haut a gauche de l'editeur
	 */
	const controlsButtons = main_container.querySelector('.tui-image-editor-header-buttons');
	if (controlsButtons) {
		const loadDiv = controlsButtons.querySelector('div');
		if (loadDiv) {
			loadDiv.childNodes.forEach(node => {
				if (node.nodeType === Node.TEXT_NODE) {
					const original = node.textContent?.trim();
					if (original === "Load" && node.textContent) {
						node.textContent = node.textContent.replace("Load", trad["load"]);
					}
				}
			});
		}
	}
	/**
	 * Traduction des autres elements
	 */
	elements.forEach(element => {
		const text = element.firstChild?.textContent;
		const match = text?.match(/^\s*([A-Za-zÀ-ÿ0-9 '’\-]+)\s*$/);
		if (!match) {
			return;
		}
		const lowerText = match[1].toLowerCase();
		if (text && trad[lowerText]) {
			const translatedText = trad[lowerText];
			element.firstChild.textContent = text?.replace(match[1], translatedText);
		}
	});
}

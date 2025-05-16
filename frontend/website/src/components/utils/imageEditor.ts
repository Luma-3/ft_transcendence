import ImageEditor from 'tui-image-editor';
import { getUserInfo } from '../../api/getter';
import { alertTemporary } from '../ui/alert/alertTemporary';
import { loadTranslation } from '../../i18n/Translate';

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
    }, 300);
  }
}

let main_editor: ImageEditor | null = null;


async function initImageEditor(): Promise<ImageEditor | null> {
  showEditor();
  const div_editor = document.getElementById('tui-image-editor-container') as HTMLDivElement;
  if (!div_editor) {
    throw new Error('Element #tui-image-editor-container not found');
  }
  const user = await getUserInfo();
  if (user.status === "error" || !user.data) {
    alertTemporary("error", "Error while fetching user info", 'dark');
    return null;
  }

  const theme = user.data.preferences.theme;
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
  const infos = await getUserInfo();
  if (infos.status === "error" || !infos.data) {
    alertTemporary("error", "Error while fetching user info", 'dark');
    return;
  }
  const lang = infos.data.preferences.lang;
  if (lang === "en") {
    return;
  }

  const main_container = document.querySelector<HTMLDivElement>('#tui-image-editor-container')!;
  const elements = main_container.querySelectorAll('label');
  const trad = await loadTranslation(lang);

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

export async function changePictureElement() {

  const image_old = document.getElementById('img-div') as HTMLDivElement;
  image_old.style.display = 'none'; // Hide the old image
  main_editor = await initImageEditor();
  if (!main_editor) {
    alertTemporary("error", "Error while initializing image editor", 'dark');
    return;
  }
  translateImageEditorLabel();
}

export async function saveNewPicture() {
  if (!main_editor) {
    throw new Error('Image editor not initialized');
  }
  const new_image = await main_editor.toDataURL();
  const blob = await (await fetch(new_image)).blob();
  FileSaver.saveAs(blob, 'image.png');
  const file = new Blob([new_image], { type: 'image/png' });
}

export function cancelEditor() {
  hideEditor();
  const image_old = document.getElementById('img-div') as HTMLDivElement;
  image_old.style.display = 'block'; // Show the old image
}

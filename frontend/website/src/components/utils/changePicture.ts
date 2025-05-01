import ImageEditor from 'tui-image-editor';
// import 'tui-color-picker/dist/tui-color-picker.css';
import FileSaver from 'file-saver';

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


function initImageEditor() {
	showEditor();
	const div_editor = document.getElementById('tui-image-editor-container') as HTMLDivElement;
	if (!div_editor) {
		throw new Error('Element #tui-image-editor-container not found');
	}

	div_editor.innerHTML = ''; // Clear previous content
	const headerColor = "#744FAC";
	const loadButtonColor = "#FF8904";
	const loadButtonfontFamily = "Chillax";
	const backgroundColor = "#F8E9E9";
	const editor = new ImageEditor(div_editor, {
		includeUI: {
		  loadImage: {
			path: '/images/pp.jpg',
			name: 'name',
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
		  initMenu: 'crop',
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

export async function changePictureElement() {

	const image_old = document.getElementById('img-div') as HTMLDivElement;
	image_old.style.display = 'none'; // Hide the old image
	main_editor = initImageEditor();
}

export async function saveNewPicture() {
	if (!main_editor) {
		throw new Error('Image editor not initialized');
	}
	const new_image = await main_editor.toDataURL();
	const blob = await (await fetch(new_image)).blob();
	FileSaver.saveAs(blob, 'image.png');
	const file = new Blob([new_image], { type: 'image/png' });
	console.log(file);
}

export function cancelEditor() {
	hideEditor();
	const image_old = document.getElementById('img-div') as HTMLDivElement;
	image_old.style.display = 'block'; // Show the old image
}
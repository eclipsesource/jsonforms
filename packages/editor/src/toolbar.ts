import * as _ from 'lodash';
import * as Ajv from 'ajv';
import { Editor } from './editor';

/**
 * Handler for a file input change event.
 * Loads the file, converts it to JSON and validates it against the editor's schema.
 * If these steps are successful, the loaded data is set in the editor.
 */
const fileInputHandler = editor => evt => {
  // triggered after a file was selected
  const target = evt.target as HTMLInputElement;
  const files = target.files;
  if (_.isEmpty(files) || files.length > 1) {
    return;
  }
  const file = files[0];
  const reader = new FileReader();

  // Callback when the file was loaded
  reader.onload = () => {
    if (reader.result === undefined || reader.result === null) {
      console.error('Could not read data');
    }
    let readData;
    try {
      readData = JSON.parse(reader.result);
    } catch (err) {
      console.error('The loaded file did not contain valid JSON.', err);
      alert(`The selected file '${file.name}' does not contain valid JSON`);

      return;
    }
    if (!_.isEmpty(readData)) {
      const ajv = new Ajv();
      const valid = ajv.validate(editor.schema, readData);
      if (valid) {
        editor.data = readData;
      } else {
        alert('Loaded data does not adhere to the specified schema.');
        console.error('Loaded data does not adhere to the specified schema.');

        return;
      }
    }
  };

  reader.readAsText(file);
};

/**
 * Configures the given button to allow uploading data as a file to the given editor.
 *
 * @param {Editor} editor The editor for which data is uploaded
 * @param {HTMLElement} uploadButton The button that will trigger the upload dialog
 */
export const configureUploadButton = (editor: Editor, uploadButton: HTMLElement) => {
  // create hidden file input element
  const fileInput = document.createElement('input') as HTMLInputElement;
  fileInput.type = 'file';
  fileInput.style.display = 'none';
  fileInput.addEventListener('change', fileInputHandler(editor));

  // the button triggers the hidden input element
  uploadButton.onclick = () => {
    fileInput.click();
  };
};

/**
 * Configures the given button to allow uploading data as a file from the given editor.
 *
 * @param {Editor} editor The editor for which data is uploaded
 * @param {HTMLElement} downloadButton The button that will trigger the download
 */
export const configureDownloadButton = (editor: Editor, downloadButton: HTMLElement) => {
  downloadButton.onclick = () => {
    const a = document.createElement('a');
    const file = new Blob([JSON.stringify(editor.data, null, 2)], {type: 'application/json'});
    a.href = URL.createObjectURL(file);
    a.download = 'download.json';
    a.click();
    // TODO a.remove() ?
  };
};

/**
 * Creates and returns a dialog to display the editor's model data in a text area.
 */
export const createExportDataDialog = () => {
  const dialog = document.createElement('dialog') as any;
  dialog.classList.add('export-data-dialog');
  const dialogContent  = document.createElement('div');
  dialogContent.classList.add('export-data-dialog-content');
  dialog.appendChild(dialogContent);
  const dialogTitle = document.createElement('label');
  dialogTitle.innerText = 'Model Data:';
  dialogTitle.classList.add('export-data-dialog-title');
  const textarea = document.createElement('textarea');
  textarea.classList.add('export-data-dialog-textarea');
  textarea.readOnly = true;

  const buttonsDiv = document.createElement('div');
  buttonsDiv.classList.add('export-data-dialog-buttons');
  const dialogClose = document.createElement('button');
  dialogClose.innerText = 'Close';
  dialogClose.classList.add('btn');
  dialogClose.onclick = () => {
    dialog.close();
  };
  const dialogCopy = document.createElement('button');
  dialogCopy.classList.add('btn');
  dialogCopy.innerText = 'Copy';
  dialogCopy.onclick = () => {
    document.execCommand('copy');
  };
  buttonsDiv.appendChild(dialogCopy);
  buttonsDiv.appendChild(dialogClose);
  dialogContent.appendChild(dialogTitle);
  dialogContent.appendChild(textarea);
  dialogContent.appendChild(buttonsDiv);

  return dialog;
};

/**
 * Configures the given button to open the given export dialog on click and to set
 * the dialog's content according to the editor's state.
 *
 * @param {Editor} editor The editor whose data is exported
 * @param {HTMLElement} exportButton The button that will open the export dialog
 * @param exportDialog The export dialog that is used to display the data
 *                     {@see createExportDataDialog}
 */
export const configureExportButton =
   (editor: Editor,
    exportButton: HTMLElement,
    exportDialog) => {
      exportButton.onclick = () => {
        const json = JSON.stringify(editor.data, null, 2);
        const textarea =
          exportDialog.getElementsByTagName('textarea').item(0) as HTMLTextAreaElement;
        textarea.textContent = json;
        exportDialog.showModal();
        textarea.focus();
        textarea.select();
     };
};

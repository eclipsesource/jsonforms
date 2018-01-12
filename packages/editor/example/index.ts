/* tslint:disable:no-invalid-this */
import './ereference.renderer';
import './eattribute.renderer';
import '../src/jsoneditor';
import './ecore-editor';
import {
  configureDownloadButton,
  configureExportButton,
  configureUploadButton,
  createExportDataDialog
} from '../src/toolbar';
import { applyMaterialStyle } from '../src/material.styling';
import { EcoreEditor } from './ecore-editor';

window.onload = () => {
  const editor = document.createElement('ecore-editor') as EcoreEditor;
  const exportDialog = createExportDataDialog();
  document.body.appendChild(exportDialog);

  const exportButton = document.getElementById('export-data-button') as HTMLButtonElement;
  configureExportButton(editor, exportButton, exportDialog);

  // button triggering the hidden input element - only activate after schemas was loaded
  const uploadButton = document.getElementById('upload-data-button') as HTMLButtonElement;
  configureUploadButton(editor, uploadButton);

  // configure button to download model data.
  const downloadButton = document.getElementById('download-data-button') as HTMLButtonElement;
  configureDownloadButton(editor, downloadButton);

  document.getElementById('editor').appendChild(editor);

  applyMaterialStyle();
};

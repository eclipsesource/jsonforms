import { Editor } from './editor';
import { Store } from 'redux';
import { Actions, getData, getSchema, getUiSchema } from '@jsonforms/core';
import { JsonFormsElement } from '@jsonforms/webcomponent';
import TreeRenderer from './tree/TreeRenderer';
import {
  configureDownloadButton,
  configureExportButton,
  configureUploadButton,
  createExportDataDialog
} from './toolbar';
import { SchemaServiceImpl } from './services/schema.service.impl';
import { EditorContext } from './editor-context';
import '@jsonforms/webcomponent';
import { getIdentifyingProperty, getModelMapping } from './reducers';

export class JsonEditorIde extends HTMLElement implements Editor {
  private connected: boolean;
  private _store: Store<any>;
  private editor: JsonFormsElement;

  connectedCallback(): void {
    this.connected = true;
    this.render();
  }
  diconnectedCallback(): void {
    this.connected = false;
  }

  set store(store: Store<any>) {
    this._store = store;
  }

  set data(data: Object) {
    this._store.dispatch(Actions.update('', () => data));
  }

  get data() {
    return getData(this._store.getState());
  }

  get schema() {
    return getSchema(this._store.getState());
  }

  private render(): void {
    if (!this.connected || this._store === undefined) {
      return;
    }

    // FIXME we still need an editor context for the schema service
    const editorContext: EditorContext = {
      dataSchema: getSchema(this._store.getState()),
      modelMapping: getModelMapping(this._store.getState()),
      identifyingProperty: getIdentifyingProperty(this._store.getState())
    };

    const schemaService = new SchemaServiceImpl(editorContext);

    if (this.editor === undefined || this.editor === null) {
      this.editor = document.createElement('json-forms') as JsonFormsElement;
      this.appendChild(this.editor);
    }
    this.editor.setInnerComponent(
      TreeRenderer,
      {
        uischema: getUiSchema(this._store.getState()),
        schema: getSchema(this._store.getState()),
        schemaService
      });
    this.editor.store = this._store;

    const exportButton = document.getElementById('export-data-button') as HTMLButtonElement;
    if (exportButton !== null) {
      const exportDialog = createExportDataDialog();
      document.body.appendChild(exportDialog);
      configureExportButton(this, exportButton, exportDialog);
    }

    // button triggering the hidden input element - only activate after schemas was loaded
    const uploadButton = document.getElementById('upload-data-button') as HTMLButtonElement;
    if (uploadButton !== null) {
      configureUploadButton(this, uploadButton);
    }

    // configure button to download model data.
    const downloadButton = document.getElementById('download-data-button') as HTMLButtonElement;
    if (downloadButton !== null) {
      configureDownloadButton(this, downloadButton);
    }
  }
}

if (!customElements.get('json-editor-ide')) {
  customElements.define('json-editor-ide', JsonEditorIde);
}

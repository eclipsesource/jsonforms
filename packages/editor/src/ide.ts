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
import '@jsonforms/webcomponent';
import * as JsonRefs from 'json-refs';

export class JsonEditorIde extends HTMLElement implements Editor {
  private connected: boolean;
  private _store: Store<any>;
  private editor: JsonFormsElement;
  private _filterPredicate: any;
  private _namingPredicate: any;
  private _imageGetterPredicate: any;

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

  /**
   * Filtering selected list item from available items
   * @param filterPredicate
   */
  set filterPredicate(filterPredicate: any) {
    this._filterPredicate = filterPredicate;
  }

  /**
   * Calculating name for the selected list item
   * @param namingPredicate
   */
  set namingPredicate(namingPredicate: any) {
    this._namingPredicate = namingPredicate;
  }

  /**
   * Calculating class name to provide image to list item
   * @param imageGetterPredicate
   */
  set imageGetterPredicate(imageGetterPredicate: any) {
    this._imageGetterPredicate = imageGetterPredicate;
  }


  private render(): void {
    if (!this.connected || this._store === undefined) {
      return;
    }

    if (this.editor === undefined || this.editor === null) {
      this.editor = document.createElement('json-forms') as JsonFormsElement;
      this.appendChild(this.editor);
    }

    JsonRefs.resolveRefs(getSchema(this._store.getState()))
      .then(
        resolvedSchema => {
        this.editor.setInnerComponent(
          TreeRenderer,
          {
            uischema: getUiSchema(this._store.getState()),
            schema: resolvedSchema.resolved,
            filterPredicate: this._filterPredicate,
            namingPredicate: this._namingPredicate,
            imageGetterPredicate: this._imageGetterPredicate
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
      },
        err => {
        console.log(err.stack);
      });
  }
}

if (!customElements.get('json-editor-ide')) {
  customElements.define('json-editor-ide', JsonEditorIde);
}

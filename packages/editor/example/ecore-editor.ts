import { JsonSchema } from '@jsonforms/core';
import '../src/jsoneditor';
import './ereference.renderer';
import './eattribute.renderer';
import { JsonEditor } from '../src/jsoneditor';
import { Editor } from '../src/editor';
import { editorConfig } from './ecore-config';
// import { ecoreSchema } from './schema';

export class EcoreEditor extends HTMLElement implements Editor {
  // private dataObject: Object;
  public useLocalREST = false;
  private connected = false;
  private editor: JsonEditor;

  constructor() {
    super();
  }
  connectedCallback(): void {
    this.connected = true;
    this.render();
  }
  diconnectedCallback(): void {
    this.connected = false;
  }

  set data(data: Object) {
    if (this.editor !== undefined && this.editor !== null) {
      this.editor.data = data;

      return;
    }
    console.warn('Could not set data of ecore editor because it has not been rendered, yet.');
  }

  get data(): Object {
    if (this.editor !== undefined && this.editor !== null) {
      return this.editor.data;
    }

    return null;
  }

  get schema(): JsonSchema {
    if (this.editor !== undefined && this.editor !== null) {
      return this.editor.schema;
    }

    return undefined;
  }

  private render() {
    if (!this.connected) {
      return;
    }
    if (this.editor === undefined) {
      this.editor = document.createElement('json-editor') as JsonEditor;
      this.editor.configure(editorConfig);
      this.editor.identifyingProperty = '_id';
    }

    this.appendChild(this.editor);
  }
}

if (!customElements.get('ecore-editor')) {
  customElements.define('ecore-editor', EcoreEditor);
}

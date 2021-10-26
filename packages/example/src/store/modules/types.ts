import {
  JsonFormsRendererRegistryEntry,
  JsonFormsCellRendererRegistryEntry,
} from '@jsonforms/core';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import AJV from 'ajv';

// declare your own store states
export interface AppState {
  drawer: boolean | null;
  jsonforms: {
    readonly: boolean;
    validationMode: 'ValidateAndShow' | 'ValidateAndHide' | 'NoValidation';
    config: {
      restrict: boolean;
      trim: boolean;
      showUnfocusedDescription: boolean;
      hideRequiredAsterisk: boolean;
    };
    renderers: JsonFormsRendererRegistryEntry[];
    cells: JsonFormsCellRendererRegistryEntry[];
    ajv: AJV.Ajv;
  };
  monaco: {
    schemaModel: monaco.editor.ITextModel | undefined;
    uischemaModel: monaco.editor.ITextModel | undefined;
    dataModel: monaco.editor.ITextModel | undefined;
  };
}

import editorApi from 'monaco-editor/esm/vs/editor/editor.api';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { JsonSchema } from '@jsonforms/core';

import { jsonSchemaDraft7, ruleSchema, uiSchema } from '../core/jsonschema';

export type EditorApi = typeof editorApi;

/**
 * Register a new schema for the Json language, if it isn't already registered.
 * Schemas are identified by their uri and fileMatch rule, so that they don't
 * leak into unrelated Json editors.
 * @param editor
 *  The monaco editor
 * @param schemas
 *  Schemas to register
 */
export const addSchema = (
  editor: EditorApi,
  schemas: {
    uri: string;
    fileMatch?: string[];
    schema?: JsonSchema;
  }[]
): void => {
  const registeredSchemas =
    editor.languages.json.jsonDefaults.diagnosticsOptions.schemas;
  if (registeredSchemas === undefined || registeredSchemas.length === 0) {
    editor.languages.json.jsonDefaults.setDiagnosticsOptions({
      validate: true,
      allowComments: false,
      enableSchemaRequest: false,
      schemaRequest: 'warning',
      schemaValidation: 'error',
      schemas: [...schemas],
    });
  } else {
    for (const schema of schemas) {
      const fileMatch = schema.fileMatch;

      const gridSchema = registeredSchemas.find(
        (registeredSchema) =>
          registeredSchema.fileMatch === fileMatch &&
          registeredSchema.uri === schema.uri
      );
      if (!gridSchema) {
        registeredSchemas.push({ ...schema });
      }
    }
  }
};

/**
 * Configures the Monaco Editor to validate the input against JSON Schema Draft 7.
 */
export const configureJsonSchemaValidation = (
  editor: EditorApi,
  fileMatch: string[]
): void => {
  /** Note that the Monaco Editor only supports JSON Schema Draft 7 itself,
   * so if we also want to support a later standard we still have to formalize
   * it in JSON Schema Draft 7*/
  addSchema(editor, [{ ...jsonSchemaDraft7, fileMatch }]);
};

/**
 * Configures the Monaco Editor to validate the input against the UI Schema meta-schema.
 */
export const configureUISchemaValidation = (
  editor: EditorApi,
  fileMatch: string[]
): void => {
  /** Note that the Monaco Editor only supports JSON Schema Draft 7 itself,
   * so if we also want to support a later standard we still have to formalize
   * it in JSON Schema Draft 7*/
  addSchema(editor, [
    { ...jsonSchemaDraft7 },
    { ...ruleSchema },
    { ...uiSchema, fileMatch },
  ]);
};

/**
 * Configures the Monaco Editor to validate the input against JSON Schema model schema.
 */
export const configureDataValidation = (
  editor: EditorApi,
  uri: string,
  fileMatch: string,
  schema: JsonSchema
): void => {
  /** Note that the Monaco Editor only supports JSON Schema Draft 7 itself,
   * so if we also want to support a later standard we still have to formalize
   * it in JSON Schema Draft 7*/
  addSchema(editor, [{ schema, uri, fileMatch: [fileMatch] }]);
};

export const getMonacoModelForUri = (
  modelUri: monaco.Uri,
  initialValue: string | undefined
): editorApi.editor.ITextModel => {
  const value = initialValue ?? '';
  let model = monaco.editor.getModel(modelUri);
  if (model) {
    model.setValue(value);
  } else {
    model = monaco.editor.createModel(value, 'json', modelUri);
  }
  return model;
};

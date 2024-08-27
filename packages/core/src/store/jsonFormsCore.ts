import Ajv, { ErrorObject } from 'ajv';
import { JsonSchema, UISchemaElement } from '../models';
import get from 'lodash/get';
import { errorsAt } from '../util';
import {
  JsonFormsCellRendererRegistryEntry,
  JsonFormsCore,
  JsonFormsRendererRegistryEntry,
  JsonFormsState,
  JsonFormsUISchemaRegistryEntry,
} from './store';

const getErrorsAt =
  (
    instancePath: string,
    schema: JsonSchema,
    matchPath: (path: string) => boolean
  ) =>
  (state: JsonFormsCore): ErrorObject[] => {
    const errors = state.errors ?? [];
    const additionalErrors = state.additionalErrors ?? [];
    return errorsAt(
      instancePath,
      schema,
      matchPath
    )(
      state.validationMode === 'ValidateAndHide'
        ? additionalErrors
        : [...errors, ...additionalErrors]
    );
  };

export const errorAt = (instancePath: string, schema: JsonSchema) =>
  getErrorsAt(instancePath, schema, (path) => path === instancePath);
export const subErrorsAt = (instancePath: string, schema: JsonSchema) =>
  getErrorsAt(instancePath, schema, (path) =>
    path.startsWith(instancePath + '.')
  );

export const getErrorAt =
  (instancePath: string, schema: JsonSchema) => (state: JsonFormsState) => {
    return errorAt(instancePath, schema)(state.jsonforms.core);
  };

export const getSubErrorsAt =
  (instancePath: string, schema: JsonSchema) => (state: JsonFormsState) =>
    subErrorsAt(instancePath, schema)(state.jsonforms.core);

export const getData = (state: JsonFormsState) =>
  extractData(get(state, 'jsonforms.core'));
export const getSchema = (state: JsonFormsState): JsonSchema =>
  extractSchema(get(state, 'jsonforms.core'));
export const getUiSchema = (state: JsonFormsState): UISchemaElement =>
  extractUiSchema(get(state, 'jsonforms.core'));
export const getAjv = (state: JsonFormsState): Ajv =>
  extractAjv(get(state, 'jsonforms.core'));
export const getRenderers = (
  state: JsonFormsState
): JsonFormsRendererRegistryEntry[] => get(state, 'jsonforms.renderers');
export const getCells = (
  state: JsonFormsState
): JsonFormsCellRendererRegistryEntry[] => get(state, 'jsonforms.cells');
export const getUISchemas = (
  state: JsonFormsState
): JsonFormsUISchemaRegistryEntry[] => get(state, 'jsonforms.uischemas');

export const extractData = (state: JsonFormsCore) => get(state, 'data');
export const extractSchema = (state: JsonFormsCore) => get(state, 'schema');
export const extractUiSchema = (state: JsonFormsCore) => get(state, 'uischema');
export const extractAjv = (state: JsonFormsCore) => get(state, 'ajv');

export const getConfig = (state: JsonFormsState) => state.jsonforms.config;

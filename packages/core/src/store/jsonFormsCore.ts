import type Ajv from 'ajv';
import type { ErrorObject } from 'ajv';
import { JsonSchema, UISchemaElement } from '../models';
import get from 'lodash/get';
import { errorsAt } from '../util';
import type { FormValidator } from '../util/formValidator';
import type { RuleValidator } from '../util/runtime';
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
/** The Form Validator currently bound to the form schema, if validation is on. */
export const getValidator = (
  state: JsonFormsState
): FormValidator | undefined => extractValidator(get(state, 'jsonforms.core'));
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
/**
 * What rule conditions are evaluated with: the configured Form Validator when
 * a custom one is set (the bound one, or the option itself while validation is
 * off), otherwise the AJV instance.
 */
export const getRuleValidator = (state: JsonFormsState): RuleValidator => {
  const core: JsonFormsCore | undefined = get(state, 'jsonforms.core');
  if (core === undefined) {
    return undefined;
  }
  if (core.validatorOption !== undefined) {
    return core.formValidator ?? core.validatorOption;
  }
  return core.ajv;
};
export const extractValidator = (
  state: JsonFormsCore
): FormValidator | undefined => get(state, 'formValidator');

export const getConfig = (state: JsonFormsState) => state.jsonforms.config;

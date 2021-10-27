import { ErrorObject } from 'ajv';
import { UISchemaElement } from '../models';
import { formatErrorMessage } from '../util';
import { i18nJsonSchema, ErrorTranslator, Translator } from './i18nTypes';

export const getI18nKey = (
  schema: i18nJsonSchema | undefined,
  uischema: UISchemaElement | undefined,
  key: string
): string | undefined => {
  if (uischema?.options?.i18n) {
    return `${uischema.options.i18n}.${key}`;
  }
  if (schema?.i18n) {
    return `${schema.i18n}.${key}`;
  }
  return undefined;
};

export const defaultTranslator: Translator = (_id: string, defaultMessage: string | undefined) => defaultMessage;

export const defaultErrorTranslator: ErrorTranslator = (error, t, uischema) => {
  // check whether there is a special keyword message
  const keyInSchemas = getI18nKey(
    error.parentSchema,
    uischema,
    `error.${error.keyword}`
  );
  const specializedKeywordMessage = keyInSchemas && t(keyInSchemas, undefined);
  if (specializedKeywordMessage !== undefined) {
    return specializedKeywordMessage;
  }

  // check whether there is a generic keyword message
  const genericKeywordMessage = t(`error.${error.keyword}`, undefined);
  if (genericKeywordMessage !== undefined) {
    return genericKeywordMessage;
  }

  // check whether there is a customization for the default message
  const messageCustomization = t(error.message, undefined);
  if (messageCustomization !== undefined) {
    return messageCustomization;
  }

  // rewrite required property messages (if they were not customized) as we place them next to the respective input
  if (error.keyword === 'required') {
    return t('is a required property', 'is a required property');
  }

  return error.message;
};

/**
 * Returns the determined error message for the given errors.
 * All errors must correspond to the given schema and uischema.
 */
export const getCombinedErrorMessage = (
  errors: ErrorObject[],
  et: ErrorTranslator,
  t: Translator,
  schema?: i18nJsonSchema,
  uischema?: UISchemaElement
) => {
  if (errors.length > 0 && t) {
    // check whether there is a special message which overwrites all others
    const keyInSchemas = getI18nKey(schema, uischema, 'error.custom');
    const specializedErrorMessage = keyInSchemas && t(keyInSchemas, undefined);
    if (specializedErrorMessage !== undefined) {
      return specializedErrorMessage;
    }
  }
  return formatErrorMessage(
    errors.map(error => et(error, t, uischema))
  );
};

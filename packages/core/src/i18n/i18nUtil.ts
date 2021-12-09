import { ErrorObject } from 'ajv';
import { UISchemaElement } from '../models';
import { getControlPath } from '../reducers';
import { formatErrorMessage } from '../util';
import { i18nJsonSchema, ErrorTranslator, Translator } from './i18nTypes';

export const getI18nKeyPrefixBySchema = (
  schema: i18nJsonSchema | undefined,
  uischema: UISchemaElement | undefined
): string | undefined => {
  return uischema?.options?.i18n ?? schema?.i18n ?? undefined;
};

/**
 * Transforms a given path to a prefix which can be used for i18n keys.
 * Returns 'root' for empty paths and removes array indices
 */
export const transformPathToI18nPrefix = (path: string) => {
  return (
    path
      ?.split('.')
      .filter(segment => !/^\d+$/.test(segment))
      .join('.') || 'root'
  );
};

export const getI18nKeyPrefix = (
  schema: i18nJsonSchema | undefined,
  uischema: UISchemaElement | undefined,
  path: string | undefined
): string | undefined => {
  return (
    getI18nKeyPrefixBySchema(schema, uischema) ??
    transformPathToI18nPrefix(path)
  );
};

export const getI18nKey = (
  schema: i18nJsonSchema | undefined,
  uischema: UISchemaElement | undefined,
  path: string | undefined,
  key: string
): string | undefined => {
  return `${getI18nKeyPrefix(schema, uischema, path)}.${key}`;
};

export const defaultTranslator: Translator = (_id: string, defaultMessage: string | undefined) => defaultMessage;

export const defaultErrorTranslator: ErrorTranslator = (error, t, uischema) => {
  // check whether there is a special keyword message
  const i18nKey = getI18nKey(
    error.parentSchema,
    uischema,
    getControlPath(error),
    `error.${error.keyword}`
  );
  const specializedKeywordMessage = t(i18nKey, undefined);
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
  if (error.keyword === 'required' && error.message?.startsWith('must have required property')) {
    return t('is a required property', 'is a required property');
  }

  return error.message;
};

/**
 * Returns the determined error message for the given errors.
 * All errors must correspond to the given schema, uischema or path.
 */
export const getCombinedErrorMessage = (
  errors: ErrorObject[],
  et: ErrorTranslator,
  t: Translator,
  schema?: i18nJsonSchema,
  uischema?: UISchemaElement,
  path?: string
) => {
  if (errors.length > 0 && t) {
    // check whether there is a special message which overwrites all others
    const customErrorKey = getI18nKey(schema, uischema, path, 'error.custom');
    const specializedErrorMessage = t(customErrorKey, undefined);
    if (specializedErrorMessage !== undefined) {
      return specializedErrorMessage;
    }
  }
  return formatErrorMessage(
    errors.map(error => et(error, t, uischema))
  );
};

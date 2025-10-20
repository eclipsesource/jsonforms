import type { ErrorObject } from 'ajv';
import { Labelable, UISchemaElement } from '../models';
import type { i18nJsonSchema, ErrorTranslator, Translator } from '../store';
import {
  ArrayDefaultTranslation,
  ArrayTranslations,
} from './arrayTranslations';
import {
  CombinatorDefaultTranslation,
  CombinatorTranslations,
} from './combinatorTranslations';
import {
  formatErrorMessage,
  getControlPath,
  isInternationalized,
} from '../util';

export const getI18nKeyPrefixBySchema = (
  schema: i18nJsonSchema | undefined,
  uischema: unknown | undefined
): string | undefined => {
  if (isInternationalized(uischema)) {
    return uischema.i18n;
  }
  return schema?.i18n ?? undefined;
};

/**
 * Transforms a given path to a prefix which can be used for i18n keys.
 * Returns 'root' for empty paths and removes array indices
 */
export const transformPathToI18nPrefix = (path: string): string => {
  return (
    path
      ?.split('.')
      .filter((segment) => !/^\d+$/.test(segment))
      .join('.') || 'root'
  );
};

export const getI18nKeyPrefix = (
  schema: i18nJsonSchema | undefined,
  uischema: unknown | undefined,
  path: string | undefined
): string => {
  return (
    getI18nKeyPrefixBySchema(schema, uischema) ??
    transformPathToI18nPrefix(path)
  );
};

export const getI18nKey = (
  schema: i18nJsonSchema | undefined,
  uischema: unknown | undefined,
  path: string | undefined,
  key: string
): string => {
  return `${getI18nKeyPrefix(schema, uischema, path)}.${key}`;
};

export const addI18nKeyToPrefix = (
  i18nKeyPrefix: string,
  key: string
): string => {
  return `${i18nKeyPrefix}.${key}`;
};

export const defaultTranslator: Translator = (
  _id: string,
  defaultMessage: string | undefined
) => defaultMessage;

export const defaultErrorTranslator: ErrorTranslator = (error, t, uischema) => {
  // check whether there is a special keyword message
  const i18nKey = getI18nKey(
    error.parentSchema,
    uischema,
    getControlPath(error),
    `error.${error.keyword}`
  );
  const specializedKeywordMessage = t(i18nKey, undefined, { error });
  if (specializedKeywordMessage !== undefined) {
    return specializedKeywordMessage;
  }

  // check whether there is a generic keyword message
  const genericKeywordMessage = t(`error.${error.keyword}`, undefined, {
    error,
  });
  if (genericKeywordMessage !== undefined) {
    return genericKeywordMessage;
  }

  // check whether there is a customization for the default message
  const messageCustomization = t(error.message, undefined, { error });
  if (messageCustomization !== undefined) {
    return messageCustomization;
  }

  // rewrite required property messages (if they were not customized) as we place them next to the respective input
  if (
    error.keyword === 'required' &&
    error.message?.startsWith('must have required property')
  ) {
    return t('is a required property', 'is a required property', { error });
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
    const specializedErrorMessage = t(customErrorKey, undefined, {
      schema,
      uischema,
      path,
      errors,
    });
    if (specializedErrorMessage !== undefined) {
      return specializedErrorMessage;
    }
  }
  return formatErrorMessage(errors.map((error) => et(error, t, uischema)));
};

/**
 * This can be used to internationalize the label of the given Labelable (e.g. UI Schema elements).
 * This should not be used for controls as there we have additional context in the form of the JSON Schema available.
 */
export const deriveLabelForUISchemaElement = (
  uischema: Labelable<boolean>,
  t: Translator
): string | undefined => {
  if (uischema.label === false) {
    return undefined;
  }
  if (
    (uischema.label === undefined ||
      uischema.label === null ||
      uischema.label === true) &&
    !isInternationalized(uischema)
  ) {
    return undefined;
  }
  const stringifiedLabel =
    typeof uischema.label === 'string'
      ? uischema.label
      : JSON.stringify(uischema.label);
  const i18nKeyPrefix = getI18nKeyPrefixBySchema(undefined, uischema);
  const i18nKey =
    typeof i18nKeyPrefix === 'string'
      ? `${i18nKeyPrefix}.label`
      : stringifiedLabel;
  return t(i18nKey, stringifiedLabel, { uischema: uischema });
};

export const getArrayTranslations = (
  t: Translator,
  defaultTranslations: ArrayDefaultTranslation[],
  i18nKeyPrefix: string,
  label: string
): ArrayTranslations => {
  const translations: ArrayTranslations = {};
  defaultTranslations.forEach((controlElement) => {
    const key = addI18nKeyToPrefix(i18nKeyPrefix, controlElement.key);
    translations[controlElement.key] = t(key, controlElement.default(label));
  });
  return translations;
};

export const getCombinatorTranslations = (
  t: Translator,
  defaultTranslations: CombinatorDefaultTranslation[],
  i18nKeyPrefix: string,
  label: string
): CombinatorTranslations => {
  const translations: CombinatorTranslations = {};
  defaultTranslations.forEach((controlElement) => {
    const key = addI18nKeyToPrefix(i18nKeyPrefix, controlElement.key);
    translations[controlElement.key] = t(key, controlElement.default(label));
  });
  return translations;
};

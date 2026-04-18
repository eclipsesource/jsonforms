import type { ErrorObject } from 'ajv';
import type { JsonSchema, UISchemaElement } from '../models';

export type Translator = <D extends string | undefined = undefined>(
  id: string,
  defaultMessage?: D,
  values?: any
) => D extends string ? string : string | undefined;

export type ErrorTranslator = (
  error: ErrorObject,
  translate: Translator,
  uischema?: UISchemaElement
) => string;

export interface JsonFormsI18nState {
  locale?: string;
  translate?: Translator;
  translateError?: ErrorTranslator;
}

export type i18nJsonSchema = JsonSchema & { i18n?: string };

import { Translator } from '@jsonforms/core';
import get from 'lodash/get';
import template from 'lodash/template';
import memoize from 'lodash/memoize';

export const createTranslator = (
  locale: string,
  translations?: Record<string, any>
): Translator => {
  let localeTranslations = translations ? translations[locale] : undefined;

  if (!localeTranslations && translations) {
    const dashIndex = locale.indexOf('-');
    localeTranslations =
      dashIndex > 0 ? translations[locale.substring(0, dashIndex)] : undefined;
  }

  const translate = (
    id: string,
    defaultMessage: string | undefined,
    values?: any
  ): string | undefined => {
    if (!localeTranslations) return defaultMessage;

    const message = get(localeTranslations, id);
    if (message && values) {
      return translateWithParams(message, values) ?? defaultMessage;
    }
    return message ?? defaultMessage;
  };

  return translate as Translator;
};

const translateWithParams = memoize(templateToMessage);

function templateToMessage(
  templateMessage: string,
  params: Record<string, string | number> = {}
): string {
  const compiled = template(templateMessage, {
    interpolate: /\${([\s\S]+?)}/g, // ${myVar}
  });

  try {
    return compiled(params);
  } catch (e) {
    console.log(`Unable to generate message from template: ${templateMessage}`);
    return templateMessage;
  }
}

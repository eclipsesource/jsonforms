import get from 'lodash/get';

export const createTranslator =
  (locale: string, translations?: Record<string, any>) =>
  (key: string, defaultMessage: string | undefined): string | undefined => {
    if (!translations) {
      return defaultMessage;
    }

    let localeTranslations = translations[locale];
    if (!localeTranslations) {
      // if specific locale like en-US is not available then use more generic like us
      const dashIndex = locale.indexOf('-');
      localeTranslations =
        dashIndex > 0
          ? translations[locale.substring(0, dashIndex)]
          : translations['en'];
    }
    return get(localeTranslations, key) ?? defaultMessage;
  };

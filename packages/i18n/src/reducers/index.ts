import { fetchLocale, fetchTranslation } from './i18n';

export * from './i18n';

export const getTranslations = state => fetchTranslation(state.jsonforms.i18n);

export const getLocale = state => fetchLocale(state.jsonforms.i18n);

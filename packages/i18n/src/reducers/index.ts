import { fetchTranslation } from './i18n';

export * from './i18n';

export const getTranslations = state => fetchTranslation(state.jsonforms.i18n);

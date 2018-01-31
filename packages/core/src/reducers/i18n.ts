import { SET_LOCALE, SET_NUMBER_FORMAT, SET_TRANSLATIONS } from '../actions';

export const i18nReducer = (
  state = {
    locale: navigator.languages[0]
  },
  action) => {
  switch (action.type) {
    case SET_TRANSLATIONS:
      return {
        ...state,
        translations: action.translations
      };
    case SET_LOCALE:
      return {
        ...state,
        locale: action.locale === undefined ? navigator.languages[0] : action.locale
      };
    case SET_NUMBER_FORMAT:
      return {
        ...state,
        numberFormat: action.format
      };
    default:
      return state;
  }
};

export const fetchTranslation = state => {
  return state.translations ? state.translations[state.locale] : undefined;
};

export const fetchNumberFormat = state => {
  return state.numberFormat ? state.numberFormat[state.locale] : undefined;
};

export const fetchLocale = state => state.locale;

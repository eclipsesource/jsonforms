import { SET_LOCALE, SET_TRANSLATIONS } from '../actions';

export const i18nReducer = (
  state = {},
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
        locale: action.locale
      };
    default:
      return state;
  }
};

export const fetchTranslation = state => {
  return state.translations ? state.translations[state.locale] : undefined;
};

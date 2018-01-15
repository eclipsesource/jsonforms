import { SET_LOCALE, SET_TRANSLATIONS } from '../actions';

export const i18nReducer = (
  state = {
    translations: {},
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
        locale: action.locale
      };
    default:
      return state;
  }
};

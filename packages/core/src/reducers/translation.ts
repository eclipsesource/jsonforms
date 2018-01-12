import { LOAD_TRANSLATION, SET_LOCALE } from '../actions';

export const translationReducer = (
  state = {
    translations: {},
    locale: ''
  },
  action) => {
  switch (action.type) {
    case LOAD_TRANSLATION:
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

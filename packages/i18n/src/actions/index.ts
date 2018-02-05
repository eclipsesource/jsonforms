const NAMESPACE = 'jsonforms';

export const SET_TRANSLATIONS = `${NAMESPACE}/SET_TRANSLATIONS`;
export const SET_LOCALE = `${NAMESPACE}/SET_LOCALE`;

export const setTranslationData = translations => dispatch => {
  dispatch({
    type: SET_TRANSLATIONS,
    translations,
  });
};

export const setLocale = locale => dispatch => {
  dispatch({
    type: SET_LOCALE,
    locale,
  });
};

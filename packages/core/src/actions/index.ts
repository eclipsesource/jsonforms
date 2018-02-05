import { ThunkAction } from 'redux-thunk';
import { getData } from '../reducers/index';
import { JsonFormsRendererConstructable } from '../util/renderer';
import { RankedTester } from '../testers';

const NAMESPACE = 'jsonforms';

export const INIT = `${NAMESPACE}/INIT`;
export const UPDATE_DATA = `${NAMESPACE}/UPDATE`;
export const VALIDATE = `${NAMESPACE}/VALIDATE`;
export const ADD_RENDERER = `${NAMESPACE}/ADD_RENDERER`;
export const REMOVE_RENDERER = `${NAMESPACE}/REMOVE_RENDERER`;
export const ADD_FIELD = `${NAMESPACE}/ADD_FIELD`;
export const REMOVE_FIELD = `${NAMESPACE}/REMOVE_FIELD`;
export const SET_TRANSLATIONS = `${NAMESPACE}/SET_TRANSLATIONS`;
export const SET_LOCALE = `${NAMESPACE}/SET_LOCALE`;
export const SET_NUMBER_SEPARATORS = `${NAMESPACE}/SET_NUMBER_SEPARATORS`;

// TODO: fix typings
export const update =
  (path: string, updater: (any) => any): ThunkAction<void, any, void> =>
    (dispatch, getState) => {
      dispatch(
        {
          type: UPDATE_DATA,
          path,
          updater
        }
      );
      dispatch(
        {
          type: VALIDATE,
          data: getData(getState())
        }
      );
    };

export const validate = () => (dispatch, getState) => {
  dispatch({
    type: VALIDATE,
    data: getData(getState())
  });
};

export const registerRenderer = (
  tester: RankedTester,
  renderer: JsonFormsRendererConstructable
) => ({
  type: ADD_RENDERER,
  tester,
  renderer
});

export const unregisterRenderer = (
  tester: RankedTester,
  renderer: JsonFormsRendererConstructable
) => ({
  type: REMOVE_RENDERER,
  tester,
  renderer
});

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

export const setNumberSeparators = numberSeparators => dispatch => {
  dispatch({
    type: SET_NUMBER_SEPARATORS,
    numberSeparators
  });
};

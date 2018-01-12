import { ThunkAction } from 'redux-thunk';
import { getData } from './reducers/index';
import { JsonFormsRendererConstructable } from './renderers/renderer.util';
import { RankedTester } from './testers';

export const INIT = 'INIT';
export const UPDATE_DATA = 'UPDATE';
export const UPDATE_UI = 'UPDATE_UI';
export const VALIDATE = 'VALIDATE';
export const SHOW = 'SHOW';
export const HIDE = 'HIDE';
export const ENABLE = 'ENABLE';
export const DISABLE = 'DISABLE';
export const ADD_RENDERER = 'ADD_RENDERER';
export const REMOVE_RENDERER = 'REMOVE_RENDERER';
export const ADD_FIELD = 'ADD_FIELD';
export const REMOVE_FIELD = 'REMOVE_FIELD';

export const REGISTER_STYLE = 'REGISTER_STYLE';
export const REGISTER_STYLES = 'REGISTER_STYLES';
export const UNREGISTER_STYLE = 'UNREGISTER_STYLE';

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

export const registerStyle = (styleName: string, classNames: string[]) => ({
  type: REGISTER_STYLE,
  name: styleName,
  classNames
});

export const unregisterStyle = (styleName: string) => ({
  type: UNREGISTER_STYLE,
  name: styleName
});

export const registerStyles = (styleDefs: { name: string, classNames: string[] }[]) => ({
  type: REGISTER_STYLES,
  styles: styleDefs
});

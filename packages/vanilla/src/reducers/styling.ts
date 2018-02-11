import * as _ from 'lodash';
import { REGISTER_STYLE, REGISTER_STYLES, UNREGISTER_STYLE } from '../actions';
import { StyleDef } from '../util';

const removeStyle = (styles: StyleDef[], name) => {
  const copy = styles.slice();
  _.remove(copy, styleDef => styleDef.name === name);

  return copy;
};

const registerStyle = (styles: StyleDef[], { name, classNames }) => {
  const copy = removeStyle(styles, name);
  copy.push({ name, classNames });

  return copy;
};

export const findStyle = (styles: StyleDef[]) => (style: string, ...args: any[]): string[] => {

  const foundStyle = _.find(styles, s => s.name === style);
  if (!_.isEmpty(foundStyle) && typeof foundStyle.classNames === 'function') {
    return foundStyle.classNames(args);
  } else if (!_.isEmpty(foundStyle)) {
    return foundStyle.classNames as string[];
  }

  return [];
};

export const findStyleAsClassName = (styles: StyleDef[]) =>
  (style: string, ...args: any[]): string =>
   _.join(findStyle(styles)(style, args), ' ');

export const stylingReducer = (state: StyleDef[]  = [], action) => {
  switch (action.type) {
    case REGISTER_STYLE: {
      return registerStyle(state, { name: action.name, classNames: action.classNames });
    }
    case REGISTER_STYLES: {
      return action.styles.reduce((allStyles, style) => registerStyle(allStyles, style), state);
    }
    case UNREGISTER_STYLE: {
      return removeStyle(state, action.name);
    }
    default:
      return state;
  }
};

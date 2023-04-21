/*
  The MIT License
  
  Copyright (c) 2017-2019 EclipseSource Munich
  https://github.com/eclipsesource/jsonforms
  
  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:
  
  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.
  
  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
*/
import remove from 'lodash/remove';
import join from 'lodash/join';
import filter from 'lodash/filter';
import reduce from 'lodash/reduce';
import { REGISTER_STYLE, REGISTER_STYLES, UNREGISTER_STYLE } from '../actions';
import { StyleDef } from '../styles';

const removeStyle = (styles: StyleDef[], name: string) => {
  const copy = styles.slice();
  remove(copy, (styleDef) => styleDef.name === name);

  return copy;
};

const registerStyle = (styles: StyleDef[], { name, classNames }: StyleDef) => {
  const copy = removeStyle(styles, name);
  copy.push({ name, classNames });

  return copy;
};

export const findStyle =
  (styles: StyleDef[]) =>
  (style: string, ...args: any[]): string[] => {
    const foundStyles = filter(styles, (s) => s.name === style);
    return reduce(
      foundStyles,
      (res: string[], style: StyleDef) => {
        if (typeof style.classNames === 'function') {
          return res.concat(style.classNames(args));
        }
        return res.concat(style.classNames);
      },
      []
    );
  };

export const findStyleAsClassName =
  (styles: StyleDef[]) =>
  (style: string, ...args: any[]): string =>
    join(findStyle(styles)(style, args), ' ');

// TODO
export const stylingReducer = (state: StyleDef[] = [], action: any) => {
  switch (action.type) {
    case REGISTER_STYLE: {
      return registerStyle(state, {
        name: action.name,
        classNames: action.classNames,
      });
    }
    case REGISTER_STYLES: {
      return action.styles.reduce(
        (allStyles: StyleDef[], style: StyleDef) =>
          registerStyle(allStyles, style),
        state
      );
    }
    case UNREGISTER_STYLE: {
      return removeStyle(state, action.name);
    }
    default:
      return state;
  }
};

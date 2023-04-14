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

import {
  defaultErrorTranslator,
  defaultTranslator,
  JsonFormsI18nState,
} from '../i18n';
import {
  I18nActions,
  SET_LOCALE,
  SET_TRANSLATOR,
  UPDATE_I18N,
} from '../actions';
import type { Reducer } from '../util';

export const defaultJsonFormsI18nState: Required<JsonFormsI18nState> = {
  locale: 'en',
  translate: defaultTranslator,
  translateError: defaultErrorTranslator,
};

export const i18nReducer: Reducer<JsonFormsI18nState, I18nActions> = (
  state = defaultJsonFormsI18nState,
  action
) => {
  switch (action.type) {
    case UPDATE_I18N: {
      const locale = action.locale ?? defaultJsonFormsI18nState.locale;
      const translate =
        action.translator ?? defaultJsonFormsI18nState.translate;
      const translateError =
        action.errorTranslator ?? defaultJsonFormsI18nState.translateError;

      if (
        locale !== state.locale ||
        translate !== state.translate ||
        translateError !== state.translateError
      ) {
        return {
          ...state,
          locale,
          translate,
          translateError,
        };
      }
      return state;
    }
    case SET_TRANSLATOR:
      return {
        ...state,
        translate: action.translator ?? defaultTranslator,
        translateError: action.errorTranslator ?? defaultErrorTranslator,
      };
    case SET_LOCALE:
      return {
        ...state,
        locale: action.locale ?? navigator.languages[0],
      };
    default:
      return state;
  }
};

export const fetchLocale = (state?: JsonFormsI18nState) => {
  if (state === undefined) {
    return undefined;
  }
  return state.locale;
};

export const fetchTranslator = (state?: JsonFormsI18nState) => {
  if (state === undefined) {
    return defaultTranslator;
  }
  return state.translate;
};

export const fetchErrorTranslator = (state?: JsonFormsI18nState) => {
  if (state === undefined) {
    return defaultErrorTranslator;
  }
  return state.translateError;
};

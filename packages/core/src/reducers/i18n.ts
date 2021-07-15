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

import { SET_LOCALE, SET_LOCALIZED_SCHEMAS, SET_LOCALIZED_UISCHEMAS } from '../actions';
import { JsonSchema, UISchemaElement } from '../models';
import { Reducer } from '../util';

export interface JsonFormsLocaleState {
  locale?: string;
  localizedSchemas: Map<string, JsonSchema>;
  localizedUISchemas: Map<string, UISchemaElement>;
}

const initState: JsonFormsLocaleState = {
  locale: undefined,
  localizedSchemas: new Map(),
  localizedUISchemas: new Map()
};

export const i18nReducer: Reducer<any, any> = (state = initState, action) => {
  switch (action.type) {
    case SET_LOCALIZED_SCHEMAS:
      return {
        ...state,
        localizedSchemas: action.localizedSchemas
      };
    case SET_LOCALIZED_UISCHEMAS:
      return {
        ...state,
        localizedUISchemas: action.localizedUISchemas
      };
    case SET_LOCALE:
      return {
        ...state,
        locale:
          action.locale === undefined ? navigator.languages[0] : action.locale
      };
    default:
      return state;
  }
};

export const fetchLocale = (state?: JsonFormsLocaleState) => {
  if (state === undefined) {
    return undefined;
  }
  return state.locale;
};

export const findLocalizedSchema = (locale: string) => (
  state?: JsonFormsLocaleState
): JsonSchema => {
  if (state === undefined) {
    return undefined;
  }
  return state.localizedSchemas.get(locale);
};

export const findLocalizedUISchema = (locale: string) => (
  state?: JsonFormsLocaleState
): UISchemaElement => {
  if (state === undefined) {
    return undefined;
  }
  return state.localizedUISchemas.get(locale);
};

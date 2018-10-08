import { AnyAction, Dispatch } from 'redux';
import { Translations } from '..';

/*
  The MIT License
  
  Copyright (c) 2018 EclipseSource Munich
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
const NAMESPACE = 'jsonforms';

export const SET_TRANSLATIONS = `${NAMESPACE}/SET_TRANSLATIONS`;
export const SET_LOCALE = `${NAMESPACE}/SET_LOCALE`;

export interface SetTranslationAction {
    type: 'jsonforms/SET_TRANSLATIONS';
    translations: Translations;
}

export interface SetLocaleAction {
    type: 'jsonforms/SET_LOCALE';
    locale: string;
}

export const setTranslationData =
    (translations: Translations) => (dispatch: Dispatch<AnyAction>) => {
        dispatch({
            type: SET_TRANSLATIONS,
            translations,
        });
    };

export const setLocale = (locale: string) => (dispatch: Dispatch<AnyAction>) => {
  dispatch({
    type: SET_LOCALE,
    locale,
  });
};

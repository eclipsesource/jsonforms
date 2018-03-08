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
import * as _ from 'lodash';
import * as moment from 'moment';
import { isPlainLabel, Labels } from '@jsonforms/core';
import { getLocale, getTranslations, i18nReducer } from './reducers';

export interface Translations {
  [key: string]: string;
}

/**
 * Number is formatted based on the current locale value.
 * If user enters a decimal point, the corresponding decimal separator is added as the last
 * character of the locale string
 */
export const fromNumber = (locale: string) => (data: number): string => {
  if (data === null || data === undefined) {
    return '';
  }

  return new Intl.NumberFormat(locale, {maximumFractionDigits: 10}).format(data);
};

/**
 * It coverts the given string number by the user to a valid string number before updating state
 * Local thousands separators are removed, local decimal separators are replaced with '.'
 */
export const toNumber = (value: string): number => {
  // inspired by
  // https://stackoverflow.com/questions/29255843/is-there-a-way-to-reverse-the-formatting-by-intl-numberformat-in-javascript
  const separator = new Intl.NumberFormat().format(1111).replace(/1/g, '');

  return Number(value.replace(new RegExp('\\' + separator, 'g'), ''));
};

const translate = (translations: Translations, label: string): string => {

  if (translations && _.startsWith(label, '%')) {
    const labelKey = label.substr(1, label.length);

    return translations[labelKey] ? translations[labelKey] : label;
  }

  return label;
};

export const translateLabel =
  (translations: Translations, label: string | Labels): (string | Labels) => {

    if (label === undefined || label === null) {
      return undefined;
    }

    if (isPlainLabel(label)) {
      return translate(translations, label);
    } else {
      return _.mapValues(label, l => translate(translations, l)) as Labels;
    }
  };

export const translateProps = (state, props) => {
  const label = translateLabel(getTranslations(state), props.label);
  const description = translateLabel(getTranslations(state), props.description);
  const momentLocale = moment().locale(getLocale(state));

  if (props.scopedSchema && props.scopedSchema.type === 'number') {
    return {
      ...props,
      label,
      description,
      toFormatted: fromNumber(getLocale(state)),
      fromFormatted: toNumber,
      locale: getLocale(state),
      momentLocale
    };
  }

  return {
    ...props,
    label,
    description,
    toFormatted: x => x,
    fromFormatted: x => x,
    locale: getLocale(state),
    momentLocale
  };
};

export { i18nReducer };

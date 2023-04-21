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
import { registerExamples } from '../register';
import { personCoreSchema } from './person';
import {
  JsonFormsCore,
  updateErrors,
  AnyAction,
  Dispatch,
  Translator,
} from '@jsonforms/core';
import get from 'lodash/get';
// TODO change import when types are available for ajv-i18n (from v4.x)
// eslint-disable-next-line @typescript-eslint/no-var-requires
const localize = require('ajv-i18n');

export const onChange =
  (dispatch: Dispatch<AnyAction>) =>
  (extensionState: any) =>
  ({ errors }: Pick<JsonFormsCore, 'data' | 'errors'>) => {
    if (!extensionState) {
      return;
    }
    const localiseFunc = localize[extensionState.locale.split('-')[0]];
    localiseFunc(errors);
    dispatch(updateErrors(errors));
  };

export const uischema = {
  type: 'VerticalLayout',
  elements: [
    {
      type: 'Group',
      i18n: 'basicInfoGroup',
      elements: [
        {
          type: 'Control',
          scope: '#/properties/name',
        },
        {
          type: 'Control',
          scope: '#/properties/birthDate',
        },
      ],
    },
    {
      type: 'Label',
      text: 'additionalInformationLabel',
    },
    {
      type: 'HorizontalLayout',
      elements: [
        {
          type: 'Control',
          scope: '#/properties/nationality',
        },
        {
          type: 'Control',
          scope: '#/properties/vegetarian',
        },
      ],
    },
  ],
};

export const data = {
  vegetarian: false,
  birthDate: '1985-06-02',
  personalData: {
    age: 34,
  },
  postalCode: '12345',
};

export const translations = {
  basicInfoGroup: {
    label: 'Basic Information',
  },
  additionalInformationLabel: 'Additional Information',
};
export const translate: Translator = (key: string, defaultMessage: string) => {
  return get(translations, key) ?? defaultMessage;
};

registerExamples([
  {
    name: 'i18n',
    label: 'Person (i18n)',
    data,
    schema: personCoreSchema,
    uischema,
    i18n: {
      translate: translate,
      locale: 'en',
    },
  },
]);

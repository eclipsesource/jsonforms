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
import { ArrayTranslationEnum, Translator } from '@jsonforms/core';
import { get } from 'lodash';

export const schema = {
  type: 'object',
  properties: {
    comments: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          date: {
            type: 'string',
            format: 'date',
          },
          message: {
            type: 'string',
            maxLength: 5,
          },
          enum: {
            type: 'string',
            const: 'foo',
          },
        },
      },
    },
  },
};

export const uischema = {
  type: 'VerticalLayout',
  elements: [
    {
      type: 'Control',
      scope: '#/properties/comments',
      options: {
        showSortButtons: true,
      },
    },
  ],
};

export const data = {
  comments: [
    {
      date: new Date(2001, 8, 11).toISOString().substr(0, 10),
      message: 'This is an example message',
    },
    {
      date: new Date().toISOString().substr(0, 10),
      message: 'Get ready for booohay',
    },
  ],
};

export const translations = {
  comments: {
    [ArrayTranslationEnum.noDataMessage]: 'Be the first to write a comment',
    [ArrayTranslationEnum.addTooltip]: 'Add a Comment',
    [ArrayTranslationEnum.deleteDialogAccept]: 'Delete!',
    [ArrayTranslationEnum.deleteDialogDecline]: 'Cancel!',
    [ArrayTranslationEnum.deleteDialogMessage]:
      'Are you sure you want to delete this comment?',
  },
};
export const translate: Translator = (key: string, defaultMessage: string) => {
  return get(translations, key) ?? defaultMessage;
};

registerExamples([
  {
    name: 'array-i18n',
    label: 'Array (i18n)',
    data,
    schema,
    uischema,
    i18n: {
      translate: translate,
      locale: 'en',
    },
  },
]);

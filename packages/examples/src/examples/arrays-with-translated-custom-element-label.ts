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
import { JsonSchema7, Translator } from '@jsonforms/core';

export const data = {
  article: {
    title: 'title',
    comments: [
      {
        visibility: 'PUBLIC',
        status: 'NEW',
        author: {
          name: 'John',
          type: 'WRITER',
          role: 'ROLE_1',
        },
      },
      {
        visibility: 'PRIVATE',
        status: 'REVIEWED',
        author: {
          name: 'John',
          type: 'AUTHOR',
          role: 'ROLE_2',
        },
      },
    ],
  },
};

const schema: JsonSchema7 = {
  type: 'object',
  properties: {
    article: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
        },
        comments: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              visibility: {
                type: 'string',
                enum: ['PUBLIC', 'PRIVATE'],
              },
              status: {
                type: 'string',
                oneOf: [
                  {
                    const: 'NEW',
                  },
                  {
                    const: 'REVIEWED',
                    title: 'Reviewed comment',
                  },
                ],
              },
              author: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                  },
                  type: {
                    type: 'string',
                    enum: ['AUTHOR', 'WRITER'],
                  },
                  role: {
                    type: 'string',
                    oneOf: [
                      {
                        const: 'ROLE_1',
                      },
                      {
                        const: 'ROLE_2',
                        title: 'Second role',
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

const detail = {
  type: 'VerticalLayout',
  elements: [
    {
      type: 'Control',
      scope: '#/properties/visibility',
    },
    {
      type: 'Control',
      scope: '#/properties/status',
    },
    {
      type: 'Control',
      scope: '#/properties/author/properties/name',
    },
    {
      type: 'Control',
      scope: '#/properties/author/properties/type',
    },
    {
      type: 'Control',
      scope: '#/properties/author/properties/role',
    },
  ],
};

export const uischema = {
  type: 'VerticalLayout',
  elements: [
    {
      type: 'Group',
      label:
        'Standard array control with elementLabelProp pointing on an direct enum (expected translated PUBLIC/PRIVATE)',
      elements: [
        {
          type: 'Control',
          scope: '#/properties/article/properties/comments',
          options: {
            elementLabelProp: 'visibility',
            detail: detail,
          },
        },
      ],
    },
    {
      type: 'Group',
      label:
        'Standard array control with elementLabelProp pointing on an direct oneOf (expected translated NEW/Reviewed comment)',
      elements: [
        {
          type: 'Control',
          scope: '#/properties/article/properties/comments',
          options: {
            elementLabelProp: 'status',
            detail: detail,
          },
        },
      ],
    },
    {
      type: 'Group',
      label:
        'ListWithDetail with elementLabelProp pointing on an direct enum (expected translated PUBLIC/PRIVATE)',
      elements: [
        {
          type: 'ListWithDetail',
          scope: '#/properties/article/properties/comments',
          options: {
            elementLabelProp: 'visibility',
            detail: detail,
          },
        },
      ],
    },
    {
      type: 'Group',
      label:
        'ListWithDetail with elementLabelProp pointing on an direct oneOf (expected translated NEW/Reviewed comment)',
      elements: [
        {
          type: 'ListWithDetail',
          scope: '#/properties/article/properties/comments',
          options: {
            elementLabelProp: 'status',
            detail: detail,
          },
        },
      ],
    },
    {
      type: 'Group',
      label:
        'Standard array control with elementLabelProp pointing on an deep enum (expected translated WRITER/AUTHOR)',
      elements: [
        {
          type: 'Control',
          scope: '#/properties/article/properties/comments',
          options: {
            elementLabelProp: 'author.type',
            detail: detail,
          },
        },
      ],
    },
    {
      type: 'Group',
      label:
        'Standard array control with elementLabelProp pointing on an deep oneOf (expected translated ROLE_1/Second role)',
      elements: [
        {
          type: 'Control',
          scope: '#/properties/article/properties/comments',
          options: {
            elementLabelProp: 'author.role',
            detail: detail,
          },
        },
      ],
    },
    {
      type: 'Group',
      label:
        'ListWithDetail with elementLabelProp pointing on an deep enum (expected translated WRITER/AUTHOR)',
      elements: [
        {
          type: 'ListWithDetail',
          scope: '#/properties/article/properties/comments',
          options: {
            elementLabelProp: 'author.type',
            detail: detail,
          },
        },
      ],
    },
    {
      type: 'Group',
      label:
        'ListWithDetail with elementLabelProp pointing on an deep oneOf (expected translated ROLE_1/Second role)',
      elements: [
        {
          type: 'ListWithDetail',
          scope: '#/properties/article/properties/comments',
          options: {
            elementLabelProp: 'author.role',
            detail: detail,
          },
        },
      ],
    },
  ],
};

export const translate: Translator = (key: string) => {
  return 'translator.' + key;
};

registerExamples([
  {
    name: 'array-with-translated-custom-element-label',
    label: 'Array with translated custom element label',
    data,
    schema,
    uischema,
    i18n: {
      translate: translate,
      locale: 'en',
    },
  },
]);

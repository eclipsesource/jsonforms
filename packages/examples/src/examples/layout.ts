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
import { data as personData, schema as personSchema } from './person';

export const schema = personSchema;

export const uischemaVertical = {
  type: 'VerticalLayout',
  elements: [
    {
      type: 'Control',
      label: 'Name',
      scope: '#/properties/name',
    },
    {
      type: 'Control',
      label: 'Birth Date',
      scope: '#/properties/birthDate',
    },
  ],
};
export const uischemaHorizontal = {
  type: 'HorizontalLayout',
  elements: [
    {
      type: 'Control',
      label: 'Name',
      scope: '#/properties/name',
    },
    {
      type: 'Control',
      label: 'Birth Date',
      scope: '#/properties/birthDate',
    },
  ],
};
export const uischemaGroup = {
  type: 'Group',
  label: 'My Group',
  elements: [
    {
      type: 'Control',
      label: 'Name',
      scope: '#/properties/name',
    },
    {
      type: 'Control',
      label: 'Birth Date',
      scope: '#/properties/birthDate',
    },
  ],
};
export const uischemaComplex = {
  type: 'Group',
  label: 'My Group',
  elements: [
    {
      type: 'HorizontalLayout',
      elements: [
        {
          type: 'VerticalLayout',
          elements: [
            {
              type: 'Control',
              label: 'Name',
              scope: '#/properties/name',
            },
            {
              type: 'Control',
              label: 'Birth Date',
              scope: '#/properties/birthDate',
            },
          ],
        },
        {
          type: 'VerticalLayout',
          elements: [
            {
              type: 'Control',
              label: 'Name',
              scope: '#/properties/name',
            },
            {
              type: 'Control',
              label: 'Birth Date',
              scope: '#/properties/birthDate',
            },
          ],
        },
      ],
    },
  ],
};
export const data = personData;

registerExamples([
  {
    name: 'layout-vertical',
    label: 'Layout Vertical',
    data,
    schema,
    uischema: uischemaVertical,
  },
  {
    name: 'layout-horizontal',
    label: 'Layout Horizontal',
    data,
    schema,
    uischema: uischemaHorizontal,
  },
  {
    name: 'layout-group',
    label: 'Layout Group',
    data,
    schema,
    uischema: uischemaGroup,
  },
  {
    name: 'layout-complex',
    label: 'Layout Complex',
    data,
    schema,
    uischema: uischemaComplex,
  },
]);

/*
  The MIT License
  
  Copyright (c) 2023 EclipseSource Munich
  https://github.com/eclipsesource/jsonforms
  
  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the 'Software'), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:
  
  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.
  
  THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
*/
import { registerExamples } from '../register';

export const schema = {
  type: 'object',
  properties: {
    cat1: {
      type: 'object',
      properties: {
        subcat11: {
          type: 'string',
        },
      },
    },
    cat2: {
      type: 'object',
      properties: {
        subcat21: {
          type: 'string',
        },
        subcat22: {
          type: 'string',
        },
      },
    },
    cat3: {
      type: 'object',
      properties: {
        subcat31: {
          type: 'string',
        },
        subcat32: {
          type: 'string',
        },
        subcat33: {
          type: 'string',
        },
      },
    },
  },
};

export const uischema = {
  type: 'Categorization',
  elements: [
    {
      type: 'Category',
      label: 'Cat1',
      elements: [
        {
          type: 'Categorization',
          elements: [
            {
              type: 'Category',
              label: 'SubCat1-1',
              elements: [
                {
                  type: 'Control',
                  scope: '#/properties/cat1/properties/subcat11',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'Category',
      label: 'Cat2',
      elements: [
        {
          type: 'Categorization',
          elements: [
            {
              type: 'Category',
              label: 'SubCat2-1',
              elements: [
                {
                  type: 'Control',
                  scope: '#/properties/cat2/properties/subcat21',
                },
              ],
            },
            {
              type: 'Category',
              label: 'SubCat2-2',
              elements: [
                {
                  type: 'Control',
                  scope: '#/properties/cat2/properties/subcat22',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'Category',
      label: 'Cat3',
      elements: [
        {
          type: 'Categorization',
          elements: [
            {
              type: 'Category',
              label: 'SubCat3-1',
              elements: [
                {
                  type: 'Control',
                  scope: '#/properties/cat3/properties/subcat31',
                },
              ],
            },
            {
              type: 'Category',
              label: 'SubCat3-2',
              elements: [
                {
                  type: 'Control',
                  scope: '#/properties/cat3/properties/subcat32',
                },
              ],
            },
            {
              type: 'Category',
              label: 'SubCat3-3',
              elements: [
                {
                  type: 'Control',
                  scope: '#/properties/cat3/properties/subcat33',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

export const data = {};

registerExamples([
  {
    name: 'nestedCategorization',
    label: 'Nested Categorization',
    data,
    schema,
    uischema,
  },
]);

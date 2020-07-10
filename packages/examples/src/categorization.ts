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
import { registerExamples } from './register';

export const schema = {
  type: 'object',
  properties: {
    firstName: {
      type: 'string',
      minLength: 3,
      description: 'Please enter your first name'
    },
    secondName: {
      type: 'string',
      minLength: 3,
      description: 'Please enter your second name'
    },
    vegetarian: {
      type: 'boolean'
    },
    birthDate: {
      type: 'string',
      format: 'date',
      description: 'Please enter your birth date.'
    },
    nationality: {
      type: 'string',
      enum: ['DE', 'IT', 'JP', 'US', 'RU', 'Other']
    },
    provideAddress: {
      type: 'boolean'
    },
    address: {
      type: 'object',
      properties: {
        street: {
          type: 'string'
        },
        streetNumber: {
          type: 'string'
        },
        city: {
          type: 'string'
        },
        postalCode: {
          type: 'string',
          maxLength: 5
        },
      }
    },
    vegetarianOptions: {
      type: 'object',
      properties: {
        vegan: {
          type: 'boolean'
        },
        favoriteVegetable: {
          type: 'string',
          enum: ['Tomato', 'Potato', 'Salad', 'Aubergine', 'Cucumber', 'Other']
        },
        otherFavoriteVegetable: {
          type: 'string'
        }
      }
    }
  },
};

export const uischema = {
  type: 'Categorization',
  elements: [
    {
      type: 'Category',
      label: 'Basic Information',
      elements: [
        {
          type: 'HorizontalLayout',
          elements: [
            {
              type: 'Control',
              scope: '#/properties/firstName'
            },
            {
              type: 'Control',
              scope: '#/properties/secondName'
            }
          ]
        },
        {
          type: 'HorizontalLayout',
          elements: [
            {
              type: 'Control',
              scope: '#/properties/birthDate'
            },
            {
              type: 'Control',
              scope: '#/properties/nationality'
            }
          ]
        },
        {
          type: 'Control',
          scope: '#/properties/provideAddress'
        },
        {
          type: 'Control',
          scope: '#/properties/vegetarian'
        }
      ]
    },
    {
      type: 'Category',
      label: 'Address',
      elements: [
        {
          type: 'HorizontalLayout',
          elements: [
            {
              type: 'Control',
              scope: '#/properties/address/properties/street'
            },
            {
              type: 'Control',
              scope: '#/properties/address/properties/streetNumber'
            },
          ]
        },
        {
          type: 'HorizontalLayout',
          elements: [
            {
              type: 'Control',
              scope: '#/properties/address/properties/city'
            },
            {
              type: 'Control',
              scope: '#/properties/address/properties/postalCode'
            }
          ]
        },
      ],
      rule: {
        effect: 'SHOW',
        condition: {
          scope: '#/properties/provideAddress',
          schema: { const: true }
        }
      }
    },
    {
      type: 'Category',
      label: 'Additional',
      elements: [
        {
          type: 'Control',
          scope: '#/properties/vegetarianOptions/properties/vegan'
        },
        {
          type: 'Control',
          scope: '#/properties/vegetarianOptions/properties/favoriteVegetable'
        },
        {
          type: 'Control',
          scope: '#/properties/vegetarianOptions/properties/otherFavoriteVegetable',
          rule: {
            effect: 'SHOW',
            condition: {
              scope: '#/properties/vegetarianOptions/properties/favoriteVegetable',
              schema: { const: 'Other' }
            }
          }
        },
      ],
      rule: {
        effect: 'SHOW',
        condition: {
          scope: '#/properties/vegetarian',
          schema: { const: true }
        }
      }
    }
  ]
};

export const data = {
  provideAddress: true,
  vegetarian: false
};

registerExamples([
  {
    name: 'categorization',
    label: 'Categorization',
    data,
    schema,
    uischema
  }
]);

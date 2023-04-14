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

export const schema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
    },
    dead: {
      type: 'boolean',
    },
    kindOfDead: {
      type: 'string',
      enum: ['Zombie', 'Vampire', 'Ghoul'],
    },
    vegetables: {
      type: 'boolean',
    },
    kindOfVegetables: {
      type: 'string',
      enum: ['All', 'Some', 'Only potatoes'],
    },
  },
};

export const uischema = {
  type: 'VerticalLayout',
  elements: [
    {
      type: 'Control',
      label: 'Name',
      scope: '#/properties/name',
    },
    {
      type: 'Group',
      elements: [
        {
          type: 'Control',
          label: 'Is Dead?',
          scope: '#/properties/dead',
        },
        {
          type: 'Control',
          label: 'Kind of dead',
          scope: '#/properties/kindOfDead',
          rule: {
            effect: 'ENABLE',
            condition: {
              scope: '#/properties/dead',
              schema: {
                const: true,
              },
            },
          },
        },
      ],
    },
    {
      type: 'Group',
      elements: [
        {
          type: 'Control',
          label: 'Eats vegetables?',
          scope: '#/properties/vegetables',
        },
        {
          type: 'Control',
          label: 'Kind of vegetables',
          scope: '#/properties/kindOfVegetables',
          rule: {
            effect: 'HIDE',
            condition: {
              scope: '#/properties/vegetables',
              schema: {
                const: false,
              },
            },
          },
        },
      ],
    },
  ],
};

export const data = {
  name: 'John Doe',
  dead: false,
  vegetables: false,
};

registerExamples([
  {
    name: 'rule',
    label: 'Rule',
    data,
    schema,
    uischema,
  },
]);

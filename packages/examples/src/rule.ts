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
import { registerExamples } from './register';

export const schema = {
  type: 'object',
  properties: {
    name: {
      type: 'string'
    },
    alive: {
      type: 'boolean'
    },
    kindOfDead: {
      type: 'string',
      enum: ['Zombie', 'Vampire', 'Ghoul']
    }
  }
};

export const uischema = {
  type: 'HorizontalLayout',
  elements: [
    {
      type: 'Control',
      label: 'Name',
      scope: '#/properties/name'
    },
    {
      type: 'Control',
      label: 'Is Alive?',
      scope: '#/properties/alive'
    },
    {
      type: 'Control',
      label: 'Kind of dead',
      scope: '#/properties/kindOfDead',
      rule: {
        effect: 'DISABLE',
        condition: {
          type: 'LEAF',
          scope: '#/properties/alive',
          expectedValue: false
        }
      }
    }
  ]
};

export const data = {
  name: 'John Doe',
  alive: true,
  kindOfDead: 'Zombie'
};

registerExamples([
  {
    name: 'rule',
    label: 'Rule',
    data,
    schema,
    uischema
  }
]);

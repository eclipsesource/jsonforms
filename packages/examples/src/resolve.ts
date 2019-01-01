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
  definitions: {
    address: {
      type: 'object',
      properties: {
        street_address: { type: 'string' },
        city: { type: 'string' },
        state: { type: 'string' },
        coord: { $ref: '#/definitions/coord' }
      },
      required: ['street_address', 'city', 'state']
    },
    coord: { $ref: 'http://json-schema.org/geo' }
  },
  type: 'object',
  properties: {
    address: { $ref: '#/definitions/address' }
  }
};

export const uischema = {
  type: 'VerticalLayout',
  elements: [
    {
      type: 'Control',
      scope: '#/properties/address/properties/street_address'
    },
    {
      type: 'Control',
      scope: '#/properties/address/properties/city'
    },
    {
      type: 'Control',
      scope: '#/properties/address/properties/state'
    },
    {
      type: 'Control',
      scope: '#/properties/address/properties/coord/properties/latitude'
    },
    {
      type: 'Control',
      scope: '#/properties/address/properties/coord/properties/longitude'
    }
  ]
};

export const data = {
  address: {
    street_address: 'Agnes-Pockels Bogen 1',
    city: 'Munich',
    state: 'Bavaria'
  }
};

registerExamples([
  {
    name: 'resolve',
    label: 'Resolve Remote Schema',
    data,
    schema,
    uischema
  }
]);

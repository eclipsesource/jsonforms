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
import { combineReducers, Reducer } from 'redux';
import { jsonformsReducer, JsonFormsState } from '@jsonforms/core';
import { angularMaterialRenderers } from '../../src/index';
export const schema = {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        minLength: 5
      },
      description: {
        type: 'string'
      },
      done: {
        type: 'boolean'
      }
    },
    required: ['name']
  };

export const uischema = {
  type: 'VerticalLayout',
  elements: [
    {
      type: 'Control',
      scope: '#/properties/name'
    },
    {
      type: 'Control',
      scope: '#/properties/description',
      options: {
        'multi': true
      }
    },
    {
      type: 'Control',
      scope: '#/properties/done',
      options: {
        align: 'end'
      }
    },
  ]
};

export const data = {
    name: 'Send email to Adrian',
    description: 'Confirm if you have passed the subject\nHereby ...',
    done: true,
  };

export const rootReducer: Reducer<JsonFormsState> =
  combineReducers({ jsonforms: jsonformsReducer() });

export const initialState: any = {
  jsonforms: {
    renderers: angularMaterialRenderers,
    fields: [],
  }
};

// export const store: JsonFormsStore = createStore(

// );

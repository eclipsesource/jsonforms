import { combineReducers, createStore } from 'redux';
import { ControlElement, JsonForms, jsonformsReducer, JsonFormsStore } from '@jsonforms/core';

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

export const uischema: ControlElement = undefined;

export const data = {
    name: 'Send email to Adrian',
    description: 'Confirm if you have passed the subject\nHereby ...',
    done: true,
  };

export const store: JsonFormsStore = createStore(
  combineReducers({ jsonforms: jsonformsReducer() }),
  {
    jsonforms: {
      renderers: JsonForms.renderers,
      fields: JsonForms.fields,
    }
  }
);

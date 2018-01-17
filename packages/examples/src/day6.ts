import { registerExamples } from './register';
import { connect } from 'react-redux';
import {
  JsonFormsElement,
  mapStateToControlProps,
  registerRenderer,
  unregisterRenderer
} from '@jsonforms/core';
import ConnectedRatingControl, { ratingControlTester } from './rating.control';
import {
  data as day5Data,
  schema as day5Schema,
  uischema as day5UiSchema,
} from './day5';

export const schema = day5Schema;
export const uischema = day5UiSchema;
export const data = day5Data;

const setup = (div: HTMLDivElement) => {
  const buttonRegister = document.createElement('button');
  buttonRegister.innerText = 'Register Custom Control';
  buttonRegister.onclick = () => {
    const jsonForms =  document.getElementsByTagName('json-forms')[0] as JsonFormsElement;
    jsonForms.store.dispatch(registerRenderer(ratingControlTester, ConnectedRatingControl));
  };
  div.appendChild(buttonRegister);
  const buttonUnregister = document.createElement('button');
  buttonUnregister.innerText = 'Unregister Custom Control';
  buttonUnregister.onclick = () => {
    const jsonForms =  document.getElementsByTagName('json-forms')[0] as JsonFormsElement;
    jsonForms.store.dispatch(unregisterRenderer(ratingControlTester, ConnectedRatingControl));
  };
  div.appendChild(buttonUnregister);
};
registerExamples([
  {
    name: 'day6',
    label: 'Day 6',
    data,
    schema,
    uiSchema: uischema,
    setupCallback: setup
  }
]);

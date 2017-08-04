import { JsonFormsElement } from '../../src/json-forms';
import { registerExamples } from '../example';
import { JsonForms } from '../../src/core';

const uischema = {
  'type': 'Group',
  'label': 'Registered UI Schema',
  'elements': [
    {
      'type': 'Control',
      'label': 'Name',
      'scope': {
        '$ref': '#/properties/name'
      }
    }
  ]
};
const data = {name: 'John Doe'};
// HACK to retrigger service creation
const resetServices = () => {
  const jsonforms = document.getElementsByTagName('json-forms')[0] as JsonFormsElement;
  jsonforms.data = data;
};
const tester = (testUiSchema, testData) => 5;
const setup = (div: HTMLDivElement) => {
  const registerButton = document.createElement('button');
  registerButton.innerText = 'Register UI Schema';
  JsonForms.stylingRegistry.addStyle(registerButton, 'button');
  registerButton.onclick = () => {
    JsonForms.uischemaRegistry.register(uischema, tester);
    resetServices();
  };
  div.appendChild(registerButton);
  const unregisterButton = document.createElement('button');
  JsonForms.stylingRegistry.addStyle(unregisterButton, 'button');
  unregisterButton.innerText = 'Unregister UI Schema';
  unregisterButton.onclick = () => {
    JsonForms.uischemaRegistry.deregister(uischema, tester);
    resetServices();
  };
  div.appendChild(unregisterButton);
};

registerExamples([
  {name: 'uischema_registry', label: 'UI Schema Registry', schema: undefined,
    uiSchema: undefined, data: data, setupCallback: setup}
]);

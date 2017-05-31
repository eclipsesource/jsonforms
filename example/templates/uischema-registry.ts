import {registerExamples} from '../example';
import {JsonFormsHolder} from '../../src/core';
import {JsonForms} from '../../src/json-forms';

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
  const jsonforms = <JsonForms>document.getElementsByTagName('json-forms')[0];
  jsonforms.data = data;
};
const tester = (test_uischema, test_data) => 5;
const setup = (div: HTMLDivElement) => {
  const registerButton = document.createElement('button');
  registerButton.innerText = 'Register UI Schema';
  registerButton.className = JsonFormsHolder.stylingRegistry.getAsClassName('button');
  registerButton.onclick = () => {
    JsonFormsHolder.uischemaRegistry.register(uischema, tester);
    resetServices();
  };
  div.appendChild(registerButton);
  const unregisterButton = document.createElement('button');
  unregisterButton.className = JsonFormsHolder.stylingRegistry.getAsClassName('button');
  unregisterButton.innerText = 'Unregister UI Schema';
  unregisterButton.onclick = () => {
    JsonFormsHolder.uischemaRegistry.unregister(uischema, tester);
    resetServices();
  };
  div.appendChild(unregisterButton);
};


registerExamples([
  {name: 'uischema_registry', label: 'UI Schema Registry', schema: undefined,
    uiSchema: undefined, data: data, setupCallback: setup}
]);

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
const resetServices = () => {
  const jsonforms = <JsonForms>document.getElementsByTagName('json-forms')[0];
  jsonforms.data = data;
};
const tester = (test_uischema, test_data) => 5;
const setup = (div: HTMLDivElement) => {
  const register = document.createElement('button');
  register.innerText = 'Register UI Schema';
  register.onclick = () => {
    JsonFormsHolder.uischemaRegistry.register(uischema, tester);
    resetServices();
  };
  div.appendChild(register);
  const unregister = document.createElement('button');
  unregister.innerText = 'Unregister UI Schema';
  unregister.onclick = () => {
    JsonFormsHolder.uischemaRegistry.unregister(uischema, tester);
    resetServices();
  };
  div.appendChild(unregister);
};


registerExamples([
  {name: 'uischema_registry', label: 'UI Schema Registry', schema: undefined,
    uiSchema: undefined, data: data, setupCallback: setup}
]);

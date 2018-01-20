import {
  Actions,
  getSchema,
  getUiSchema,
  getConfig,
  JsonForms,
} from '@jsonforms/core';
import { JsonFormsElement } from '@jsonforms/webcomponent';
import { registerExamples } from './register';

export const uischema = {
  type: 'Group',
  label: 'Registered UI Schema',
  elements: [
    {
      type: 'Control',
      label: 'Name',
      scope: '#/properties/name'
    }
  ]
};
export const data = {name: 'John Doe'};
// HACK to retrigger service creation
const resetServices = () => {
  const jsonforms = document.getElementsByTagName('json-forms')[0] as JsonFormsElement;
  const currentState = jsonforms.store.getState();
  jsonforms.store.dispatch({
    type: Actions.INIT,
    data,
    schema: getSchema(currentState),
    uischema: getUiSchema(currentState),
    config: getConfig(currentState),
    styles: currentState.styles
  });
};
const tester = () => 5;
const setup = (div: HTMLDivElement) => {
  const registerButton = document.createElement('button');
  registerButton.innerText = 'Register UI Schema';
  registerButton.onclick = () => {
    JsonForms.uischemaRegistry.register(uischema, tester);
    resetServices();
  };
  div.appendChild(registerButton);
  const unregisterButton = document.createElement('button');
  unregisterButton.innerText = 'Unregister UI Schema';
  unregisterButton.onclick = () => {
    JsonForms.uischemaRegistry.deregister(uischema, tester);
    resetServices();
  };
  div.appendChild(unregisterButton);
};

registerExamples([
  {
    name: 'uischema_registry',
    label: 'UI Schema Registry',
    schema: undefined,
    uiSchema: undefined,
    config: undefined,
    data: data,
    setupCallback: setup
  }
]);

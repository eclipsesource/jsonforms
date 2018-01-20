import { Actions, getConfig, getSchema, getUiSchema } from '@jsonforms/core';
import { registerExamples } from './register';
import { JsonFormsElement } from '@jsonforms/webcomponent';

const setup = (div: HTMLDivElement) => {
  const button = document.createElement('button');
  button.innerText = 'Change data';
  button.onclick = () => {
    const jsonforms = document.getElementsByTagName('json-forms')[0] as JsonFormsElement;
    const currentState = jsonforms.store.getState();
    jsonforms.store.dispatch({
      type: Actions.INIT,
      data: { id: 'aaa' },
      schema: getSchema(currentState),
      uischema: getUiSchema(currentState),
      config: getConfig(currentState),
      styles: currentState.styles
    });
  };
  div.appendChild(button);
};

registerExamples([
  {
    name: 'dynamic',
    label: 'Dynamic Change',
    schema: undefined,
    uiSchema: undefined,
    config: undefined,
    data: {name: 'bla'},
    setupCallback: setup
  }
]);

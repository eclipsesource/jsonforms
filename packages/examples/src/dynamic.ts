import { JsonFormsElement } from '@jsonforms/core';
import { registerExamples } from './register';

const setup = (div: HTMLDivElement) => {
  const button = document.createElement('button');
  button.innerText = 'Change data';
  button.onclick = () => {
    const jsonforms = document.getElementsByTagName('json-forms')[0] as JsonFormsElement;
    jsonforms.data = {id: 'aaa'};
  };
  div.appendChild(button);
};

registerExamples([
  {
    name: 'dynamic',
    label: 'Dynamic Change',
    schema: undefined,
    uiSchema: undefined,
    data: {name: 'bla'},
    setupCallback: setup
  }
]);

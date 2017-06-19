import {registerExamples} from '../example';
import {JsonFormsElement} from '../../src/json-forms';

const setup = (div: HTMLDivElement) => {
  const button = document.createElement('button');
  button.innerText = 'Change data';
  button.onclick = () => {
    const jsonforms = <JsonFormsElement>document.getElementsByTagName('json-forms')[0];
    jsonforms.data = {id: 'aaa'};
  };
  div.appendChild(button);
};


registerExamples([
  {name: 'dynamic', label: 'Dynamic Change', schema: undefined,
    uiSchema: undefined, data: {name: 'bla'}, setupCallback: setup}
]);

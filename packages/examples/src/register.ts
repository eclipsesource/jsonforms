import { JsonFormsElement } from '@jsonforms/webcomponent';
import { ExampleDescription } from './example';

declare let exampleDivId;
declare let viewDivId;

const knownExamples: {[key: string]: ExampleDescription} = {};

export interface AdditionalState {
  [x: string]: any;
}

export const registerExamples = (examples: ExampleDescription[]): void => {
  examples.forEach(example => knownExamples[example.name] = example);
};

export const changeExample = (selectedExample: string, additionalState: AdditionalState) => {
  let body = document.getElementById(viewDivId);
  if (body.firstChild !== null && body.firstChild.childNodes.length !== 0) {
    body.removeChild(body.firstChild);
  }
  const example: ExampleDescription = knownExamples[selectedExample];
  if (example.setupCallback !== undefined) {
    const div = document.createElement('div');
    example.setupCallback(div);
    body.appendChild(div);
    body = div;
  }

  const jsonForms = document.createElement('json-forms') as JsonFormsElement;
  jsonForms.state = {
    data: example.data,
    schema: example.schema,
    uischema: example.uiSchema,
    translations: example.translations,
    locale: example.locale,
    config: example.config,
    ...additionalState
  };

  body.appendChild(jsonForms);
};

export const createExampleSelection = (additionalState?: AdditionalState): HTMLSelectElement => {
  const examplesDiv = document.getElementById(exampleDivId);
  const labelExample = document.createElement('label');
  labelExample.textContent = 'Example:';
  labelExample.htmlFor = 'example_select';
  examplesDiv.appendChild(labelExample);
  const select = document.createElement('select');
  select.id = 'example_select';
  Object.keys(knownExamples).forEach(key => {
    const example = knownExamples[key];
    const option = document.createElement('option');
    option.value = example.name;
    option.label = example.label;
    option.text = example.label;
    select.appendChild(option);
  });
  select.onchange = () => {
    changeExample(select.value, additionalState);
  };
  examplesDiv.appendChild(select);
  changeExample(select.value, additionalState);

  return select;
};

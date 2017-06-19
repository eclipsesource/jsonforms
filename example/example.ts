import {JsonSchema} from '../src/models/jsonSchema';
import {UISchemaElement} from '../src/models/uischema';
import {JsonFormsElement} from '../src/json-forms';

declare let exampleDivId;
declare let viewDivId;
export interface ExampleDescription {
  name: string;
  label: string;
  data: any;
  schema: JsonSchema;
  uiSchema: UISchemaElement;
  setupCallback?: (div: HTMLDivElement) => void;
}
let knownExamples: {[key: string]: ExampleDescription} = {};

export const registerExamples = (examples: Array<ExampleDescription>): void => {
  examples.forEach(example => knownExamples[example.name] = example);
};
export const changeExample = (selectedExample: string) => {
  let body = document.getElementById(viewDivId);
  if (body.firstChild) {
    body.removeChild(body.firstChild);
  }
  const example: ExampleDescription = knownExamples[selectedExample];
  if (example.setupCallback !== undefined) {
    const div = document.createElement('div');
    example.setupCallback(div);
    body.appendChild(div);
    body = div;
  }

  const jsonForms = <JsonFormsElement> document.createElement('json-forms');
  jsonForms.data = example.data;
  if (example.uiSchema !== undefined) {
    jsonForms.uiSchema = example.uiSchema;
  }
  if (example.schema !== undefined) {
    jsonForms.dataSchema = example.schema;
  }

  body.appendChild(jsonForms);
};
export const createExampleSelection = (): HTMLSelectElement => {
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
  select.onchange = () => (changeExample(select.value));
  examplesDiv.appendChild(select);
  changeExample(select.value);
  return select;
};

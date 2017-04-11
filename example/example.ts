import {JsonSchema} from '../src/models/jsonSchema';
import {UISchemaElement} from '../src/models/uischema';
import {JsonForms} from '../src/json-forms';
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
const changeExample = (selectedExample: string) => {
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

  const jsonForms = <JsonForms> document.createElement('json-forms');
  jsonForms.data = example.data;
  if (example.uiSchema !== undefined) {
    jsonForms.uiSchema = example.uiSchema;
  }
  if (example.schema !== undefined) {
    jsonForms.dataSchema = example.schema;
  }

  body.appendChild(jsonForms);
};
window.onload = (ev) => {
  const examplesDiv = document.getElementById(exampleDivId);
  const select = document.createElement('select');
  Object.keys(knownExamples).forEach(key => {
    const example = knownExamples[key];
    const option = document.createElement('option');
    option.value = example.name;
    option.label = example.label;
    select.appendChild(option);
  });
  select.onchange = () => (changeExample(select.value));
  examplesDiv.appendChild(select);
  changeExample(select.value);
};

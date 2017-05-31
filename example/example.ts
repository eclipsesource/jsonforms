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
let knownStyles : {[key: string]: string} = {
  normal: 'Normal Label Top',
  dark: 'Dark label Top',
  labelFixed: 'Label left Fixed'
};
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
const crateExampleSelection = () => {
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
    select.appendChild(option);
  });
  select.onchange = () => (changeExample(select.value));
  examplesDiv.appendChild(select);
  changeExample(select.value);
}
const changeStyle = (style: string) => {
  document.body.className = style;
};
const createStyleSelection = () => {
  const examplesDiv = document.getElementById('examples');
  const labelStyle = document.createElement('label');
  labelStyle.textContent = 'Style:';
  labelStyle.htmlFor = 'example_style';
  examplesDiv.appendChild(labelStyle);
  const select = document.createElement('select');
  select.id = 'example_style';
  Object.keys(knownStyles).forEach(key => {
    const style = knownStyles[key];
    const option = document.createElement('option');
    option.value = key;
    option.label = style;
    select.appendChild(option);
  });
  select.onchange = (ev: Event) => (changeStyle(select.value));
  examplesDiv.appendChild(select);
}
window.onload = (ev) => {
  crateExampleSelection();
  createStyleSelection();
};

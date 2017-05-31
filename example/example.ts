import * as _ from 'lodash';
import {JsonFormsHolder} from '../src/core';
import {JsonSchema} from '../src/models/jsonSchema';
import {UISchemaElement} from '../src/models/uischema';
import {JsonForms} from '../src/json-forms';
import {Style} from '../src/core/styling.registry';

declare let $;
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
const createExampleSelection = (): HTMLSelectElement => {
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

const changeTheme = (style: string) => {
  document.body.className = style;
};

const createThemeSelection = () => {
  const themeDiv = document.getElementById('theme');

  const select = document.createElement('select');
  select.id = 'example_theme';
  Object.keys(knownStyles).forEach(key => {
    const style = knownStyles[key];
    const option = document.createElement('option');
    option.value = key;
    option.label = style;
    option.text = style;
    select.appendChild(option);
  });
  select.onchange = (ev: Event) => (changeTheme(select.value));

  const themeLabel = document.createElement('label');
  themeLabel.textContent = 'Theme:';
  themeLabel.htmlFor = 'example_theme';

  themeDiv.appendChild(themeLabel);
  themeDiv.appendChild(select);
};

function createStyleSelection(selectExampleElement: HTMLSelectElement) {
  const styleDiv = document.getElementById('style');
  // create select element for selecting style to be applied
  const selectStyle = document.createElement('select');
  ['none', 'bootstrap', 'materialize'].forEach(style => {
    const option = document.createElement('option');
    option.value = style;
    option.label = _.capitalize(style);
    option.text = style;
    selectStyle.appendChild(option);
  });
  selectStyle.onchange = () => {
    changeStyle(selectStyle.value);
    // re-render the easy way
    const currentExample = selectExampleElement.value;
    changeExample(currentExample);
  };
  const styleLabel = document.createElement('label');
  styleLabel.innerText = 'Style';
  styleDiv.appendChild(styleLabel);
  styleDiv.appendChild(selectStyle);

  changeStyle('none');
}

window.onload = (ev) => {
  const selectExampleElement = createExampleSelection();
  createThemeSelection();
  createStyleSelection(selectExampleElement);
};

function changeStyle(style) {
  $('select').material_select('destroy');
  if (style === 'bootstrap') {
    bootstrap();
  } else if (style === 'materialize') {
    material();
  } else {
    none();
  }
}

function none() {
  enableLink('example')
}

function bootstrap() {
  enableLink('bootstrap');
  JsonFormsHolder.stylingRegistry.registerMany([
    {
      name: 'button',
      classNames: ['btn', 'btn-primary']
    },
    {
      name: 'select',
      classNames: ['custom-select']
    },
  ]);
  $('select').attr('class', JsonFormsHolder.stylingRegistry.getAsClassName('select'));
}

function material() {
  enableLink('materialize');
  JsonFormsHolder.stylingRegistry.register(
    'button',
    ['btn', 'waves-effect', 'waves-light']
  );
  JsonFormsHolder.stylingRegistry.unregister('select');
  $('select').material_select();
}

/**
 * Disables all links and only enables the one containing the wanted href.
 * This function assumes that all links are CSS links used for styling purposes.
 *
 * @param wantedHref a substring of the link's href value, which is to be enabled
 */
function enableLink(wantedHref: string): void {
  const links = $('link').toArray();
  // disable all links
  _.forEach(links, link => link.disabled = true);
  const wantedLink = _.find(links, (link: HTMLLinkElement) => link.href.includes(wantedHref));
  // enable wanted link
  wantedLink.disabled = false;
}

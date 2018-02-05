import { JsonFormsElement } from '@jsonforms/webcomponent';
import { ExampleDescription } from './example';
import { JsonForms, jsonformsReducer } from '@jsonforms/core';
import { applyMiddleware, createStore, Reducer } from 'redux';
import thunk from 'redux-thunk';
import { i18nReducer, translateProps } from '@jsonforms/i18n';

declare let exampleDivId;
declare let viewDivId;

const knownExamples: {[key: string]: ExampleDescription} = {};

export interface AdditionalStoreParams {
  name: string;
  reducer: Reducer<any>;
  state: any;
}

export const registerExamples = (examples: ExampleDescription[]): void => {
  examples.forEach(example => knownExamples[example.name] = example);
};

export const changeExample = (selectedExample: string, ...additionalStoreParams: AdditionalStoreParams[]) => {
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
  const additionalReducers = additionalStoreParams.reduce(
    (acc, x) => {
      acc[x.name] = x.reducer;
      return acc;
    },
    {}
  );
  const additionalInitState = additionalStoreParams.reduce(
    (acc, x) => {
      acc[x.name] = x.state;
      return acc;
    },
    {}
  );

  jsonForms.store = createStore(
    jsonformsReducer(
      {
        i18n: i18nReducer,
        ...additionalReducers
      },
    ),
    {
      jsonforms: {
        common: {
          data: example.data,
          schema: example.schema,
          uischema: example.uiSchema
        },
        i18n: {
          translations: example.translations,
          locale: example.locale || navigator.language
        },
        transformProps: [translateProps],
        renderers: JsonForms.renderers,
        fields: JsonForms.fields,
        ...additionalInitState
      }
    },
    applyMiddleware(thunk)
  );

  body.appendChild(jsonForms);
};

export const createExampleSelection = (...additionalStoreParams: AdditionalStoreParams[]): HTMLSelectElement => {

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
    changeExample(select.value, ...additionalStoreParams);
  };
  examplesDiv.appendChild(select);
  changeExample(select.value, ...additionalStoreParams);

  return select;
};

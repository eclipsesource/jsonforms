import { JsonFormsElement } from '@jsonforms/webcomponent';
import { ExampleDescription } from './example';
import { jsonformsReducer, RankedTester } from '@jsonforms/core';
import { combineReducers, createStore, Reducer } from 'redux';
import { i18nReducer, translateProps } from '@jsonforms/i18n';

declare let exampleDivId;
declare let viewDivId;

const knownExamples: {[key: string]: ExampleDescription} = {};

export interface AdditionalStoreParams {
  name: string;
  reducer?: Reducer<any>;
  state: any;
}

export const registerExamples = (examples: ExampleDescription[]): void => {
  examples.forEach(example => knownExamples[example.name] = example);
};

export const changeExample =
  (selectedExample: string,
   renderers: { tester: RankedTester, renderer: any}[],
   fields: { tester: RankedTester, field: any}[],
   ...additionalStoreParams: AdditionalStoreParams[]) => {
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
        if (x.reducer) {
          acc[x.name] = x.reducer;
        }

        return acc;
      },
      {} as any
    );
    const additionalInitState = additionalStoreParams.reduce(
      (acc, x) => {
        acc[x.name] = x.state;

        return acc;
      },
      {} as any
    );

    jsonForms.store = createStore(
      combineReducers({
        jsonforms: jsonformsReducer(
          {
            i18n: i18nReducer,
            ...additionalReducers
          },
        )
      }
      ),
      {
        jsonforms: {
          core: {
            data: example.data,
            schema: example.schema,
            uischema: example.uiSchema
          },
          renderers,
          fields,
          i18n: {
            translations: example.translations,
            locale: example.locale || navigator.language,
          },
          transformProps: [translateProps],
          ...additionalInitState
        }
      }
    );

    body.appendChild(jsonForms);
  };

export const createExampleSelection = (
  renderers: { tester: RankedTester, renderer: any}[],
  fields: { tester: RankedTester, field: any}[],
  ...additionalStoreParams: AdditionalStoreParams[]
): HTMLSelectElement => {

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
      changeExample(select.value, renderers, fields,  ...additionalStoreParams);
    };
    examplesDiv.appendChild(select);
    changeExample(select.value, renderers, fields, ...additionalStoreParams);

    return select;
  };

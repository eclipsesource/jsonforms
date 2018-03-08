/*
  The MIT License
  
  Copyright (c) 2018 EclipseSource Munich
  https://github.com/eclipsesource/jsonforms
  
  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:
  
  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.
  
  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
*/
import { JsonFormsElement } from '@jsonforms/webcomponent';
import { ExampleDescription } from './example';
import { jsonformsReducer, JsonFormsState, RankedTester } from '@jsonforms/core';
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
      combineReducers<JsonFormsState>({
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
          config: example.config,
          i18n: {
            translations: example.translations,
            locale: example.locale || navigator.languages[0],
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

/*
  The MIT License

  Copyright (c) 2017-2019 EclipseSource Munich
  https://github.com/eclipsesource/jsonforms

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the 'Software'), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
*/

import React, { useEffect, useState } from 'react';
import { JsonForms, JsonFormsInitStateProps, JsonFormsReactProps } from '@jsonforms/react';
import { ExampleDescription } from '@jsonforms/examples';
import {
  JsonFormsCellRendererRegistryEntry,
  JsonFormsRendererRegistryEntry,
  JsonSchema
} from '@jsonforms/core';
import { resolveRefs } from 'json-refs';
import './App.css';

type AppProps = {
  examples: ExampleDescription[],
  cells: JsonFormsCellRendererRegistryEntry[],
  renderers: JsonFormsRendererRegistryEntry[],
}

const ResolvedJsonForms = (
  props: JsonFormsInitStateProps & JsonFormsReactProps
) => {
  const [init, setInit] = useState(false);
  const [schema, setSchema] = useState<JsonSchema>();
  useEffect(() => {
    if (!props.schema) {
      setInit(true);
      setSchema(props.schema);
    } else {
      resolveRefs(props.schema).then((result) => {
        setInit(true);
        setSchema(result.resolved);
      });
    }
  }, [props.schema]);
  if (!init) {
    return null;
  }
  return <JsonForms {...props} schema={schema} />;
};

const getProps = (example: ExampleDescription, cells?: any, renderers?: any) => {
  const schema = example.schema;
  const uischema = example.uischema;
  const data = example.data;
  const uischemas = example.uischemas;
  const config = example.config;
  return {
    schema,
    uischema,
    data,
    config,
    uischemas,
    cells,
    renderers
  }
}

const App = ({ examples, cells, renderers}: AppProps) => {
  const [currentExample, setExample] = useState<ExampleDescription>(examples[0]);
  const [currentIndex, setIndex] = useState<number>(0);
  const [dataAsString, setDataAsString] = useState<any>('');
  const [props, setProps] = useState<any>(getProps(currentExample, cells, renderers)); // helper function

  const actions: any = currentExample.actions;

  const changeExample = (exampleID: number) => {
    let example = examples[exampleID];
    setIndex(exampleID);
    setExample(example);
    setProps(getProps(example, cells, renderers));
  };

  const changeData = (data: any) => {
    setDataAsString(JSON.stringify(data, null, 2));
  };

  return (
    <div>
      <div className='App'>
        <header className='App-header'>
          <img src='assets/logo.svg' className='App-logo' alt='logo' />
          <h1 className='App-title'>Welcome to JSON Forms with React</h1>
          <p className='App-intro'>More Forms. Less Code.</p>
        </header>
        <div className='content'>
          <h4 className='data-title'>Examples</h4>
          <div className='data-content'>
            <select
              value={currentIndex}
              onChange={ev => changeExample(Number(ev.currentTarget.value))}
            >
              {examples.map((optionValue: ExampleDescription, index: number) => (
                <option
                  value={index}
                  label={optionValue.label}
                  key={index}
                >
                  {optionValue.label}
                </option>
              ))}
            </select>
          </div>

          <h4 className='data-title'>Bound data</h4>
          <div className='data-content'>
            <pre>{dataAsString}</pre>
          </div>
          <div className='demoform'>
            <div className="buttons">
              {actions?.map((action: any, index: number) => (
                <button onClick = { () => setProps((oldProps: JsonFormsInitStateProps) => action.apply(oldProps)) } key={index}>{action.label}</button>
              ))}
            </div>
            <ResolvedJsonForms
              key={currentIndex}
              {...props}
              onChange={({ data }) => changeData(data)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

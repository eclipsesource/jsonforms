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

import React, { useEffect, useMemo, useState } from 'react';
import { JsonForms, JsonFormsInitStateProps, JsonFormsReactProps } from '@jsonforms/react';
import { ExampleDescription } from '@jsonforms/examples';
import {
  JsonFormsCellRendererRegistryEntry,
  JsonFormsRendererRegistryEntry,
  JsonSchema
} from '@jsonforms/core';
import { resolveRefs } from 'json-refs';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Highlight from 'react-highlight';
import 'highlight.js/styles/default.css';
import './App.css';

type AppProps = {
  examples: ExampleDescription[],
  cells: JsonFormsCellRendererRegistryEntry[],
  renderers: JsonFormsRendererRegistryEntry[],
};

type Action = {
  label: string,
  apply: any
};

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
  const i18n = example.i18n;
  return {
    schema,
    uischema,
    data,
    config,
    uischemas,
    cells,
    renderers,
    i18n
  }
}

const App = ({ examples, cells, renderers}: AppProps) => {
  const [currentExample, setExample] = useState<ExampleDescription>(examples[0]);
  const [currentIndex, setIndex] = useState<number>(0);
  const [dataAsString, setDataAsString] = useState<any>('');
  const [props, setProps] = useState<any>(getProps(currentExample, cells, renderers));
  const [showPanel, setShowPanel] = useState<boolean>(true);
  const schemaAsString = useMemo(() => JSON.stringify(props.schema, null, 2), [props.schema]);
  const uiSchemaAsString = useMemo(() => JSON.stringify(props.uischema, null, 2), [props.uischema]);

  const actions: Action[] = currentExample.actions;

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    const exampleIndex = examples.findIndex(example => {
      return example.name === hash
    });
    if(exampleIndex !== -1) {
      changeExample(exampleIndex);
    }
  }, []);

  const changeExample = (exampleID: number) => {
    let example = examples[exampleID];
    setIndex(exampleID);
    setExample(example);
    setProps(getProps(example, cells, renderers));
    window.location.hash = example.name;
    if(example.name == 'huge') {
      setShowPanel(false);
    }
  };

  const changeData = (data: any) => {
    setDataAsString(JSON.stringify(data, null, 2));
  };

  return (
    <div>
      <div className='App'>
        <header className='header'>
          <img src='assets/logo.svg' className='logo' alt='logo' />
          <h1 className='title'>Welcome to JSON Forms with React</h1>
          <p className='intro'>More Forms. Less Code.</p>
        </header>
        <div className='content'>
          <div className='tools'>
            <div className='example-selector'>
              <h4>Select Example:</h4>
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
            <div className='toggle-panel'>
              <input type='checkbox' id='panel' name='panel' checked={showPanel} onChange={() => setShowPanel(prevShow => !prevShow)} />
              <label htmlFor='panel'>Show sidepanel</label>
            </div>
          </div>

          <div className='demo-wrapper'>
            { showPanel && 
              <div className='props-panel'>
                <Tabs>
                  <TabList>
                    <Tab>Data</Tab>
                    <Tab>Schema</Tab>
                    <Tab>UISchema</Tab>
                  </TabList>
                  <div className="panel-wrapper">
                    <TabPanel>
                      <Highlight className='json'>
                        {dataAsString}
                      </Highlight>
                    </TabPanel>
                    <TabPanel>
                      <Highlight className='json'>
                        {schemaAsString}
                      </Highlight>
                    </TabPanel>
                    <TabPanel>
                      <Highlight className='json'>
                        {uiSchemaAsString}
                      </Highlight>
                    </TabPanel>
                  </div>
                </Tabs>
              </div>
            }
            <div className='demoform'>
              <div className='buttons'>
                {actions?.map((action: Action, index: number) => (
                  <button className='action-button' onClick={ () => setProps((oldProps: JsonFormsInitStateProps) => action.apply(oldProps))} key={index}>{action.label}</button>
                ))}
              </div>
              <div className='demo'>
                <ResolvedJsonForms
                  key={currentIndex}
                  {...props}
                  onChange={({ data }) => changeData(data)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

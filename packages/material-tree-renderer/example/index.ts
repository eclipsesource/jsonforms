/*
  The MIT License
  
  Copyright (c) 2017-2019 EclipseSource Munich
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
import keys from 'lodash/keys';
import React from 'react';
import ReactDOM from 'react-dom';
import { combineReducers, createStore, Store } from 'redux';
import {
  Actions,
  jsonformsReducer,
  JsonFormsState,
  JsonSchema,
  NOT_APPLICABLE,
  UISchemaElement,
  UISchemaTester
} from '@jsonforms/core';
import {
  materialCells,
  materialRenderers
} from '@jsonforms/material-renderers';
import { taskSchema } from './schema';
import { Property } from '../src/services/property.util';
import App from './App';
import { taskView, userGroupView, userView } from './uischemata';
import { imageProvider } from './imageProvider';
import {
  InstanceLabelProvider,
  SchemaLabelProvider
} from '../src/helpers/LabelProvider';

const uischema = {
  type: 'MasterDetailLayout',
  scope: '#'
};

const detailSchemata: {
  tester: UISchemaTester;
  uischema: UISchemaElement;
}[] = [
  {
    tester: schema =>
      keys(schema.properties).some(key => key === 'done') ? 1 : NOT_APPLICABLE,
    uischema: taskView
  },
  {
    tester: schema =>
      keys(schema.properties).some(key => key === 'birthday')
        ? 1
        : NOT_APPLICABLE,
    uischema: userView
  },
  {
    tester: schema =>
      keys(schema.properties).some(key => key === 'users') ? 1 : NOT_APPLICABLE,
    uischema: userGroupView
  }
];

const filterPredicate = (data: any) => (property: Property): boolean => {
  if (
    data._type !== undefined &&
    property.schema.properties._type.default !== undefined
  ) {
    return data._type === property.schema.properties._type.default;
  } else {
    return false;
  }
};

const isUserGroup = (schema: JsonSchema) =>
  schema.properties.users !== undefined;
const isTask = (schema: JsonSchema) => schema.properties.done !== undefined;
const isUser = (schema: JsonSchema) => schema.properties.birthday !== undefined;

const schemaLabelProvider: SchemaLabelProvider = (
  schema: JsonSchema,
  schemaPath: string
): string => {
  if (isUserGroup(schema)) {
    return `User Group`;
  }

  if (schemaPath.indexOf('task') !== -1) {
    return `Task`;
  }

  if (isUser(schema)) {
    return `User`;
  }

  return 'Unknown';
};

const instanceLabelProvider: InstanceLabelProvider = (
  schema: JsonSchema,
  data: any
): string => {
  if (isUserGroup(schema)) {
    return `User Group`;
  }

  if (isTask(schema)) {
    return `Task ${data.name || ''}`;
  }

  if (isUser(schema)) {
    return `User ${data.name || ''}`;
  }

  return 'Unknown';
};

const initState: any = {
  jsonforms: {
    renderers: materialRenderers,
    cells: materialCells
  }
};

const store: Store<any> = createStore(
  combineReducers<JsonFormsState>({
    jsonforms: jsonformsReducer()
  }),
  { ...initState }
);

store.dispatch(Actions.init({}, taskSchema, uischema));
store.dispatch(
  Actions.registerDefaultData('properties.users.items', { name: 'Test user' })
);

detailSchemata.forEach(({ tester, uischema: detailedUiSchema }) =>
  store.dispatch(Actions.registerUISchema(tester, detailedUiSchema))
);

ReactDOM.render(
  React.createElement(
    App,
    {
      store,
      filterPredicate,
      labelProviders: {
        forData: instanceLabelProvider,
        forSchema: schemaLabelProvider
      },
      imageProvider: imageProvider
    },
    null
  ),
  document.getElementById('editor')
);

import { LabelDefinition } from '../src/helpers/util';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { combineReducers, createStore, Store } from 'redux';
import { detailSchemata, imageProvider, labelProvider, modelMapping } from './config';
import { taskSchema } from './schema';
import { materialFields, materialRenderers } from '@jsonforms/material-renderers';
import * as _ from 'lodash';
import { findAllContainerProperties, Property } from '../src/services/property.util';
import { JsonSchema7 } from '@jsonforms/core';
import { setContainerProperties, treeWithDetailReducer } from '../src/reducers';
import * as JsonRefs from 'json-refs';
import {
  Actions,
  jsonformsReducer,
  RankedTester
} from '@jsonforms/core';
import App from './App';

const uischema = {
  'type': 'MasterDetailLayout',
  'scope': '#'
};

const filterPredicate = (data: Object) => {
  return (property: Property): boolean => {
    if (!_.isEmpty(modelMapping) &&
      !_.isEmpty(modelMapping.mapping)) {
      if (data[modelMapping.attribute]) {
        return property.schema.$id === modelMapping.mapping[data[modelMapping.attribute]];
      }
      return true;
    }
  };
};

const calculateLabel =
  (schema: JsonSchema7) => (element: Object): string => {

    if (!_.isEmpty(labelProvider) && labelProvider[schema.$id] !== undefined) {

      if (typeof labelProvider[schema.$id] === 'string') {
        // To be backwards compatible: a simple string is assumed to be a property name
        return element[labelProvider[schema.$id]];
      }
      if (typeof labelProvider[schema.$id] === 'object') {
        const info =  labelProvider[schema.$id] as LabelDefinition;
        let label;
        if (info.constant !== undefined) {
          label = info.constant;
        }
        if (!_.isEmpty(info.property) && !_.isEmpty(element[info.property])) {
          label = _.isEmpty(label) ?
            element[info.property] :
            `${label} ${element[info.property]}`;
        }
        if (label !== undefined) {
          return label;
        }
      }
    }

    const namingKeys = Object
      .keys(schema.properties)
      .filter(key => {
        console.log(key);
        return key === '$id' || key === 'name';
      });
    if (namingKeys.length !== 0) {
      return element[namingKeys[0]];
    }

    return JSON.stringify(element);
  };

const imageGetter = (schemaId: string) =>
  !_.isEmpty(imageProvider) ? `icon ${imageProvider[schemaId]}` : '';

const renderers: { tester: RankedTester, renderer: any}[] = materialRenderers;
const fields: { tester: RankedTester, field: any}[] = materialFields;

const jsonforms: any = {
  jsonforms: {
    renderers,
    fields,
    treeWithDetail: {
      imageMapping: imageProvider,
      labelMapping: labelProvider,
      modelMapping,
      uiSchemata: detailSchemata
    }
  }
};

const store: Store<any> = createStore(
  combineReducers({
      jsonforms: jsonformsReducer(
        {
          treeWithDetail: treeWithDetailReducer
        }
      )
    }
  ),
  {
    ...jsonforms
  }
);

JsonRefs.resolveRefs(taskSchema)
  .then(
    resolvedSchema => {
      store.dispatch(Actions.init({}, resolvedSchema.resolved, uischema));

      store.dispatch(setContainerProperties(findAllContainerProperties(resolvedSchema.resolved,
                                                                       resolvedSchema.resolved)));

      ReactDOM.render(
        React.createElement(
          App, {
          store,
          filterPredicate,
          labelProvider: calculateLabel,
          imageProvider: imageGetter
        },
          null
        ),
        document.getElementById('editor'));
    },
    err => {
      console.log(err.stack);
    });

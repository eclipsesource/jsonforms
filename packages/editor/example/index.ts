import '../src/ide';
import { JsonEditorIde } from '../src/ide';
import { createEditorStore, LabelDefinition } from '../src/helpers/util';
import { detailSchemata, imageProvider, labelProvider, modelMapping } from './config';
import { taskSchema } from './schema';
import { materialFields, materialRenderers } from '@jsonforms/material-renderers';
import * as _ from 'lodash';
import { findAllContainerProperties, Property } from '../src/services/property.util';
import { setContainerProperties } from '../src/reducers';
import { JsonSchema4 } from '@jsonforms/core';

window.onload = () => {
  const ide = document.createElement('json-editor-ide') as JsonEditorIde;

  const uischema = {
    'type': 'MasterDetailLayout',
    'scope': '#'
  };

  const filterPredicate = (data: Object) => {
    return (property: Property): boolean => {
      if (!_.isEmpty(modelMapping) &&
        !_.isEmpty(modelMapping.mapping)) {
        if (data[modelMapping.attribute]) {
          return property.schema.id === modelMapping.mapping[data[modelMapping.attribute]];
        }
        return true;
      }
    };
  };

  const getNamingFunction =
    (schema: JsonSchema4) => (element: Object): string => {

      if (!_.isEmpty(labelProvider) && labelProvider[schema.id] !== undefined) {

        if (typeof labelProvider[schema.id] === 'string') {
          // To be backwards compatible: a simple string is assumed to be a property name
          return element[labelProvider[schema.id]];
        }
        if (typeof labelProvider[schema.id] === 'object') {
          const info =  labelProvider[schema.id] as LabelDefinition;
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
        .filter(key => key === 'id' || key === 'name');
      if (namingKeys.length !== 0) {
        return element[namingKeys[0]];
      }

      return JSON.stringify(element);
    };

  const imageGetterPredicate = (schemaId: string) =>
    !_.isEmpty(imageProvider) ? `icon ${imageProvider[schemaId]}` : '';

  const store = createEditorStore({}, taskSchema, uischema, materialFields,
                                  materialRenderers, imageProvider, labelProvider, modelMapping,
                                  detailSchemata, {});

  ide.filterPredicate = filterPredicate;

  ide.namingPredicate = getNamingFunction;

  ide.imageGetterPredicate = imageGetterPredicate;

  store.dispatch(setContainerProperties(findAllContainerProperties(taskSchema, taskSchema)));

  ide.store = store;

  document.getElementById('editor').appendChild(ide);
};

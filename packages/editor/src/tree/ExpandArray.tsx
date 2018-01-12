// tslint:disable:jsx-no-multiline-js
import * as React from 'react';
import * as _ from 'lodash';
import { connect } from 'react-redux';
import {
  getData,
  Paths,
  resolveData
} from '@jsonforms/core';
import ObjectListItem from './ObjectListItem';

/**
 * Expands the given data array by expanding every element.
 * If the parent data containing the array is provided,
 * a suitable delete function for the expanded elements is created.
 *
 * @param data the array to expand
 * @param property the {@link ContainmentProperty} defining the property that the array belongs to
 * @param parentPath the instance path where data can be obtained from
 */
export const ExpandArray = (
  {
    rootData,
    schema,
    path,
    selection,
    handlers,
    uischema,
    schemaService
  }
) => {

  const data = resolveData(rootData, path);
  if (data === undefined || data === null) {
    return 'No data';
  }

  return data.map((_element, index) => {
    const composedPath = Paths.compose(path, index.toString());

    return (
      <ObjectListItem
        key={composedPath}
        path={composedPath}
        schema={schema}
        selection={selection}
        handlers={handlers}
        uischema={uischema}
        schemaService={schemaService}
      />
    );
  });
};

// TODO: update selected element once selection has been changed
export const ExpandArrayContainer = (
  {
    prop,
    path,
    schema,
    rootData,
    selection,
    uischema,
    handlers,
    schemaService
  }
) => {

  const composedPath = Paths.compose(path, prop.property);
  const propSchema = prop.schema;
  const propKey = prop.property;

  const parentProperties = schemaService.getContainmentProperties(schema);

  for (const property of parentProperties) {
    // If available, additionally use schema id to identify the correct property
    if (!_.isEmpty(propSchema.id) && propSchema.id !== property.schema.id) {
      continue;
    }
    if (propKey === property.property) {
      return (
        <ExpandArray
          schema={property.schema}
          path={composedPath}
          rootData={rootData}
          selection={selection}
          handlers={handlers}
          uischema={uischema}
          schemaService={schemaService}
        />
      );
    }
  }

  return undefined;
};

const mapStateToProps = state => ({
  rootData: getData(state)
});

export default connect(
  mapStateToProps,
  null
)(ExpandArrayContainer);

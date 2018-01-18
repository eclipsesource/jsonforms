// tslint:disable:jsx-no-multiline-js
import * as React from 'react';
import { connect } from 'react-redux';
import {
  getData,
  Paths,
  resolveData
} from '@jsonforms/core';
import ObjectListItem from './ObjectListItem';

/**
 * Expands the given root data array by expanding every element.
 * If the parent data containing the array is provided,
 * a suitable delete function for the expanded elements is created.
 *
 * As a difference to the ExpandArray component this component does not use containment
 * properties because it is only used for the root nodes of a tree.
 *
 * @param data the array to expand
 * @param schema the JsonSchema defining the property that the array belongs to
 * @param parentPath the instance path where data can be obtained from
 */
export const ExpandRootArray = (
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
          isRoot={true}
        />
      );
    });
};

// TODO: update selected element once selection has been changed
export const ExpandRootArrayContainer = (
  {
    path,
    schema,
    rootData,
    selection,
    uischema,
    handlers,
    schemaService
  }
) => {

  return (
    <ExpandRootArray
      schema={schema}
      path={path}
      rootData={rootData}
      selection={selection}
      handlers={handlers}
      uischema={uischema}
      schemaService={schemaService}
    />
  );
};

const mapStateToProps = state => ({
  rootData: getData(state)
});

export default connect(
  mapStateToProps,
  null
)(ExpandRootArrayContainer);

import * as React from 'react';
import {
  Paths
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
export const ExpandArray = ({
                       data,
                       resolvedRootData,
                       property,
                       path,
                       isSelected,
                       openDialog,
                       setSelection,
                       uischema
                     }) => {

  if (data === undefined || data === null) {
    return;
  }

  return data.map((_element, index) => {
    const composedPath = Paths.compose(path, index.toString());

    return (
      <ObjectListItem
        key={composedPath}
        path={composedPath}
        schema={property.schema}
        parentPath={path}
        isSelected={isSelected}
        openDialog={openDialog}
        setSelection={setSelection}
        uischema={uischema}
        resolvedRootData={resolvedRootData}
      />
    );
  });
};

// tslint:disable:jsx-no-multiline-js
import React from 'react';
import { JsonSchema, Paths, resolveData, UISchemaElement } from '@jsonforms/core';
import ObjectListItem from './ObjectListItem';
import { WithImageProvider, WithLabelProvider } from './TreeWithDetailRenderer';

interface ExpandRootArrayProps {
    rootData: any;
    selection: any;

    path: string;
    handlers: any;
    filterPredicate: any;
    schema: JsonSchema | JsonSchema[];
}

/**
 * Expands the given root data array by expanding every element.
 * If the parent data containing the array is provided,
 * a suitable delete function for the expanded elements is created.
 *
 * As a difference to the ExpandArray component this component does not use containment
 * properties because it is only used for the root nodes of a tree.
 *
 */
export const ExpandRootArray = (
  {
    rootData,
    schema,
    path,
    selection,
    handlers,
    filterPredicate,
    labelProvider,
    imageProvider
  }: ExpandRootArrayProps & WithLabelProvider & WithImageProvider
) => {

    const data = resolveData(rootData, path);
    if (data === undefined || data === null) {
      return 'No data';
    }

    return data.map((_element: any, index: number) => {
      const composedPath = Paths.compose(path, index.toString());

      return (
        <ObjectListItem
          key={composedPath}
          path={composedPath}
          schema={schema}
          selection={selection}
          handlers={handlers}
          isRoot={true}
          filterPredicate={filterPredicate}
          labelProvider={labelProvider}
          imageProvider={imageProvider}
        />
      );
    });
};

export interface ExpandRootArrayContainerProps extends ExpandRootArrayProps {
    uischema: UISchemaElement;
}

// TODO: update selected element once selection has been changed
export const ExpandRootArrayContainer = (
  {
    path,
    schema,
    rootData,
    selection,
    handlers,
    filterPredicate,
    labelProvider,
    imageProvider
  }: ExpandRootArrayContainerProps & WithLabelProvider & WithImageProvider
) => {

  return (
    <ExpandRootArray
      schema={schema}
      path={path}
      rootData={rootData}
      selection={selection}
      handlers={handlers}
      filterPredicate={filterPredicate}
      labelProvider={labelProvider}
      imageProvider={imageProvider}
    />
  );
};

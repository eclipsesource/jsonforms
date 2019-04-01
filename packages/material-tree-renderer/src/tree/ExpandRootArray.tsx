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

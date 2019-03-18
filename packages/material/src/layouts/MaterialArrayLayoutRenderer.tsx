/*
  The MIT License

  Copyright (c) 2018 EclipseSource Munich
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
import React from 'react';

import {
  ArrayControlProps,
  ControlElement,
  Helpers,
  isObjectArrayWithNesting,
  mapDispatchToArrayControlProps,
  mapStateToArrayControlProps,
  RankedTester,
  rankWith
} from '@jsonforms/core';
import { MaterialArrayLayout } from './MaterialArrayLayout';
import { connect } from 'react-redux';

export const MaterialArrayLayoutRenderer  = (
  {
    uischema,
    data,
    path,
    findUISchema,
    addItem,
    removeItems,
    errors,
    createDefaultValue,
    schema,
    rootSchema,
    id,
    enabled,
    visible,
    renderers
  }: ArrayControlProps) => {

  const controlElement = uischema as ControlElement;
  const labelDescription = Helpers.createLabelDescriptionFrom(controlElement);
  const label = labelDescription.show ? labelDescription.text : '';

  return (
    <MaterialArrayLayout
      data={data}
      label={label}
      path={path}
      addItem={addItem}
      removeItems={removeItems}
      findUISchema={findUISchema}
      uischema={uischema}
      schema={schema}
      errors={errors}
      rootSchema={rootSchema}
      createDefaultValue={createDefaultValue}
      id={id}
      enabled={enabled}
      visible={visible}
      renderers={renderers}
    />
  );
};

const ConnectedMaterialArrayLayoutRenderer = connect(
  mapStateToArrayControlProps,
  mapDispatchToArrayControlProps
)(MaterialArrayLayoutRenderer);

export default ConnectedMaterialArrayLayoutRenderer;
ConnectedMaterialArrayLayoutRenderer.displayName = 'MaterialArrayLayoutRenderer';

export const materialArrayLayoutTester: RankedTester = rankWith(4, isObjectArrayWithNesting);

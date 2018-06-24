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
import * as React from 'react';

import {
  ControlElement,
  DispatchPropsOfControl,
  Helpers,
  isObjectArrayWithNesting,
  JsonSchema,
  mapDispatchToTableControlProps,
  mapStateToControlProps,
  RankedTester,
  rankWith,
  Resolve,
  StatePropsOfControl,
  UISchemaElement
} from '@jsonforms/core';
import { connectToJsonForms } from '@jsonforms/react';
import { MaterialArrayLayout } from './MaterialArrayLayout';

export interface MaterialArrayLayoutRendererProps
  extends StatePropsOfControl, DispatchPropsOfControl {

  addItem(path: string);
  findUISchema(schema: JsonSchema, schemaPath: string, path: string): UISchemaElement;
}

export const MaterialArrayLayoutRenderer  =
  ({
     schema,
     uischema,
     data,
     path,
     findUISchema,
     addItem,
   }: MaterialArrayLayoutRendererProps) => {

    const controlElement = uischema as ControlElement;
    const labelDescription = Helpers.createLabelDescriptionFrom(controlElement);
    const resolvedSchema = Resolve.schema(schema, `${controlElement.scope}/items`);
    const label = labelDescription.show ? labelDescription.text : '';

    return (
      <MaterialArrayLayout
        data={data}
        label={label}
        path={path}
        resolvedSchema={resolvedSchema}
        onAdd={addItem(path)}
        controlElement={controlElement}
        findUISchema={findUISchema}
      />
    );
  };

const ConnectedMaterialArrayLayoutRenderer = connectToJsonForms(
  mapStateToControlProps,
  mapDispatchToTableControlProps
)(MaterialArrayLayoutRenderer);

export default ConnectedMaterialArrayLayoutRenderer;
ConnectedMaterialArrayLayoutRenderer.displayName = 'MaterialArrayLayoutRenderer';

export const materialArrayLayoutTester: RankedTester = rankWith(4, isObjectArrayWithNesting);

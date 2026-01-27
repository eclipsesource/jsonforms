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
import React, { useState, useMemo } from 'react';
import isEmpty from 'lodash/isEmpty';

import {
  CombinatorRendererProps,
  createCombinatorRenderInfos,
  createDefaultValue,
  isAnyOfControl,
  JsonSchema,
  RankedTester,
  rankWith,
} from '@jsonforms/core';
import { JsonFormsDispatch, withJsonFormsAnyOfProps } from '@jsonforms/react';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '../shadcn/components/ui/tabs';

export const AnyOfRenderer = ({
  handleChange,
  schema,
  rootSchema,
  indexOfFittingSchema,
  visible,
  path,
  renderers,
  cells,
  uischema,
  uischemas,
  data,
}: CombinatorRendererProps) => {
  const [selectedAnyOf, setSelectedAnyOf] = useState(indexOfFittingSchema || 0);

  const anyOfRenderInfos = useMemo(
    () =>
      createCombinatorRenderInfos(
        (schema as JsonSchema).anyOf,
        rootSchema,
        'anyOf',
        uischema,
        path,
        uischemas
      ),
    [schema, rootSchema, uischema, path, uischemas]
  );

  const handleTabChange = (value: string) => {
    const newIndex = parseInt(value, 10);
    const newSchema = anyOfRenderInfos[newIndex].schema;

    if (
      !isEmpty(data) &&
      typeof data !== typeof createDefaultValue(newSchema, rootSchema)
    ) {
      const confirmSwitch = window.confirm(
        'Switching will clear your current data. Continue?'
      );
      if (!confirmSwitch) {
        return;
      }
      handleChange(path, createDefaultValue(newSchema, rootSchema));
    }

    setSelectedAnyOf(newIndex);
  };

  if (!visible) {
    return null;
  }

  return (
    <div className='space-y-4'>
      <Tabs value={String(selectedAnyOf)} onValueChange={handleTabChange}>
        <TabsList>
          {anyOfRenderInfos.map((anyOfRenderInfo, index) => (
            <TabsTrigger key={index} value={String(index)}>
              {anyOfRenderInfo.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {anyOfRenderInfos.map((anyOfRenderInfo, index) => (
          <TabsContent key={index} value={String(index)}>
            <JsonFormsDispatch
              schema={anyOfRenderInfo.schema}
              uischema={anyOfRenderInfo.uischema}
              path={path}
              renderers={renderers}
              cells={cells}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export const anyOfControlTester: RankedTester = rankWith(3, isAnyOfControl);

export default withJsonFormsAnyOfProps(AnyOfRenderer);

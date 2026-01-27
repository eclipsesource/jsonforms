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
  isOneOfControl,
  JsonSchema,
  RankedTester,
  rankWith,
} from '@jsonforms/core';
import { JsonFormsDispatch, withJsonFormsOneOfProps } from '@jsonforms/react';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '../shadcn/components/ui/tabs';

export const OneOfRenderer = ({
  handleChange,
  schema,
  path,
  renderers,
  cells,
  rootSchema,
  visible,
  indexOfFittingSchema,
  uischema,
  uischemas,
  data,
}: CombinatorRendererProps) => {
  const [selectedIndex, setSelectedIndex] = useState(indexOfFittingSchema || 0);

  const oneOfRenderInfos = useMemo(
    () =>
      createCombinatorRenderInfos(
        (schema as JsonSchema).oneOf,
        rootSchema,
        'oneOf',
        uischema,
        path,
        uischemas
      ),
    [schema, rootSchema, uischema, path, uischemas]
  );

  const handleTabChange = (value: string) => {
    const newIndex = parseInt(value, 10);
    const newSchema = oneOfRenderInfos[newIndex].schema;

    // Check if we need to reset data when switching
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

    setSelectedIndex(newIndex);
  };

  if (!visible) {
    return null;
  }

  return (
    <div className='space-y-4'>
      <Tabs value={String(selectedIndex)} onValueChange={handleTabChange}>
        <TabsList>
          {oneOfRenderInfos.map((oneOfRenderInfo, index) => (
            <TabsTrigger key={index} value={String(index)}>
              {oneOfRenderInfo.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {oneOfRenderInfos.map((oneOfRenderInfo, index) => (
          <TabsContent key={index} value={String(index)}>
            <JsonFormsDispatch
              schema={oneOfRenderInfo.schema}
              uischema={oneOfRenderInfo.uischema}
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

export const oneOfControlTester: RankedTester = rankWith(3, isOneOfControl);

export default withJsonFormsOneOfProps(OneOfRenderer);

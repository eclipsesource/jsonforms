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

import React from 'react';
import {
  LayoutProps,
  RankedTester,
  rankWith,
  uiTypeIs,
  UISchemaElement,
  GroupLayout as GroupLayoutType,
} from '@jsonforms/core';
import { withJsonFormsLayoutProps, JsonFormsDispatch } from '@jsonforms/react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '../shadcn/components/ui/card';
import { cn } from '../shadcn/lib/utils';
import { useShadcnStyles } from '../styles/styleContext';

export const GroupLayout = (props: LayoutProps) => {
  const { uischema, schema, path, enabled, visible, renderers, cells, label } =
    props;
  const styleOverrides = useShadcnStyles();

  if (!visible) {
    return null;
  }

  const group = uischema as GroupLayoutType;

  return (
    <Card className={cn(styleOverrides?.wrapperClasses)}>
      {label && (
        <CardHeader>
          <CardTitle>{label}</CardTitle>
        </CardHeader>
      )}
      <CardContent className='flex flex-col space-y-4'>
        {group.elements.map((child: UISchemaElement, index: number) => (
          <JsonFormsDispatch
            key={`${path}-${index}`}
            uischema={child}
            schema={schema}
            path={path}
            enabled={enabled}
            renderers={renderers}
            cells={cells}
          />
        ))}
      </CardContent>
    </Card>
  );
};

export const groupLayoutTester: RankedTester = rankWith(1, uiTypeIs('Group'));

export default withJsonFormsLayoutProps(GroupLayout);

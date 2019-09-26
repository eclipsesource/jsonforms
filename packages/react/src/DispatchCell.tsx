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
import maxBy from 'lodash/maxBy';
import React, { useEffect, useState, useCallback } from 'react';
import { UnknownRenderer } from './UnknownRenderer';
import { DispatchCellProps, refResolver } from '@jsonforms/core';
import { withJsonFormsDispatchCellProps } from './JsonFormsContext';

/**
 * Dispatch renderer component for cells.
 */
const Dispatch = ({
  rootSchema,
  uischema,
  schema,
  path,
  cells,
  id,
  refParserOptions
}: DispatchCellProps) => {
  const [isTesting, setIsTesting] = useState(false);
  const [cell, setCell] = useState(undefined);
  const resolveRef = useCallback((pointer: string) => {
    return refResolver(rootSchema, refParserOptions)(pointer);
  }, [rootSchema, refParserOptions]);
  useEffect(() => {
    const test = async () => {
      setIsTesting(true);
      const prios: any[] = await Promise.all(
        cells.map(r =>
          r.tester(uischema, rootSchema, resolveRef).then(result => ({
            test: result,
            renderer: r.cell
          }))
        )
      );
      const designatedRenderer = maxBy(prios, 'test');
      setCell(designatedRenderer);
      setIsTesting(false);
    };
    test();
  }, [cells, uischema, schema, rootSchema]);

  if (cell === undefined || isTesting || cell.test === -1) {
    return <UnknownRenderer type={'cell'} />;
  } else {
    const Cell = cell.renderer;

    return (
      <React.Fragment>
        <Cell uischema={uischema} schema={schema} path={path} id={id} />
      </React.Fragment>
    );
  }
};

export const DispatchCell = withJsonFormsDispatchCellProps(Dispatch);

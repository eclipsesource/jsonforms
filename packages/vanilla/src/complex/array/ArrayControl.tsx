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
import range from 'lodash/range';
import React, { useMemo } from 'react';
import { ArrayControlProps, composePaths, createDefaultValue, findUISchema } from '@jsonforms/core';
import { JsonFormsDispatch } from '@jsonforms/react';
import { VanillaRendererProps } from '../../index';

export const ArrayControl = ({
  classNames,
  data,
  label,
  path,
  schema,
  addItem,
  uischema,
  uischemas,
  renderers,
  rootSchema
}: ArrayControlProps & VanillaRendererProps) => {
  const childUiSchema = useMemo(
    () => findUISchema(uischemas, schema, uischema.scope, path, undefined, uischema, rootSchema),
    [uischemas, schema, uischema.scope, path, uischema, rootSchema]
  );
  return (
    <div className={classNames.wrapper}>
      <fieldset className={classNames.fieldSet}>
        <legend>
          <button
            className={classNames.button}
            onClick={addItem(path, createDefaultValue(schema))}
          >
            +
          </button>
          <label className={'array.label'}>{label}</label>
        </legend>
        <div className={classNames.children}>
          {data ? (
            range(0, data.length).map(index => {
              const childPath = composePaths(path, `${index}`);

              return (
                <JsonFormsDispatch
                  schema={schema}
                  uischema={childUiSchema || uischema}
                  path={childPath}
                  key={childPath}
                  renderers={renderers}
                />
              );
            })
          ) : (
              <p>No data</p>
            )}
        </div>
      </fieldset>
    </div>
  );
};

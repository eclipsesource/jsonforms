/*
  The MIT License

  Copyright (c) 2017-2026 EclipseSource Munich
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
import React, { useMemo } from 'react';
import {
  CoreActions,
  createDefaultValue,
  JsonFormsCellRendererRegistryEntry,
  JsonFormsRendererRegistryEntry,
  JsonSchema,
  UPDATE_DATA,
  UpdateAction,
  UISchemaElement,
} from '@jsonforms/core';
import {
  JsonFormsContext,
  JsonFormsDispatch,
  useJsonForms,
} from '@jsonforms/react';

interface DynamicPropertyDispatchProps {
  cells?: JsonFormsCellRendererRegistryEntry[];
  enabled?: boolean;
  path: string;
  readonly?: boolean;
  renderers?: JsonFormsRendererRegistryEntry[];
  rootSchema: JsonSchema;
  schema: JsonSchema;
  uischema: UISchemaElement;
}

const isUpdateAction = (action: CoreActions): action is UpdateAction =>
  action.type === UPDATE_DATA;

export const DynamicPropertyDispatch = ({
  cells,
  enabled,
  path,
  readonly,
  renderers,
  rootSchema,
  schema,
  uischema,
}: DynamicPropertyDispatchProps) => {
  const jsonforms = useJsonForms();
  const dispatch = useMemo(() => {
    if (!jsonforms.dispatch) {
      return jsonforms.dispatch;
    }

    return (action: CoreActions) => {
      if (isUpdateAction(action) && action.path === path) {
        jsonforms.dispatch?.({
          ...action,
          updater: (existingData: any) => {
            const value = action.updater(existingData);
            return value === undefined
              ? createDefaultValue(schema, rootSchema)
              : value;
          },
        });
        return;
      }

      jsonforms.dispatch?.(action);
    };
  }, [jsonforms, path, rootSchema, schema]);

  const contextValue = useMemo(
    () => ({
      ...jsonforms,
      dispatch,
    }),
    [dispatch, jsonforms]
  );

  return (
    <JsonFormsContext.Provider value={contextValue}>
      <JsonFormsDispatch
        schema={schema}
        uischema={uischema}
        path={path}
        renderers={renderers}
        cells={cells}
        enabled={enabled}
        readonly={readonly}
      />
    </JsonFormsContext.Provider>
  );
};

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
import {
  findUISchema,
  setReadonly,
  StatePropsOfControlWithDetail,
  UISchemaElement,
} from '@jsonforms/core';
import cloneDeep from 'lodash/cloneDeep';
import { depsChanged } from './deps';

/**
 * Creates a memoized `findUISchema` for renderers rendering a detail.
 *
 * `findUISchema` can return the inline `options.detail` or a registered UI
 * schema, i.e. objects owned by the user, so the result is always a copy, on
 * which the `readonly` option is set when disabled. It is only recalculated
 * when one of its inputs changed, so it can be compared by identity.
 */
export const createDetailUiSchemaResolver = () => {
  let deps: unknown[] | undefined;
  let detailUiSchema: UISchemaElement | undefined;
  return (
    props: StatePropsOfControlWithDetail,
    enabled: boolean,
    schemaPath: string,
    fallback?: string | (() => UISchemaElement)
  ): UISchemaElement => {
    // `schemaPath` and `fallback` are derived from these as well
    const nextDeps = [
      props.uischema,
      props.uischemas,
      props.schema,
      props.rootSchema,
      props.path,
      enabled,
    ];
    if (!depsChanged(deps, nextDeps)) {
      return detailUiSchema;
    }
    deps = nextDeps;

    detailUiSchema = cloneDeep(
      findUISchema(
        props.uischemas,
        props.schema,
        schemaPath,
        props.path,
        fallback,
        props.uischema,
        props.rootSchema
      )
    );
    if (!enabled) {
      setReadonly(detailUiSchema);
    }
    return detailUiSchema;
  };
};

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
import React, { ComponentType, useMemo } from 'react';
import type Ajv from 'ajv';
import type { ErrorObject } from 'ajv';
import { UnknownRenderer } from './UnknownRenderer';
import {
  nextId,
  Generate,
  JsonFormsCellRendererRegistryEntry,
  JsonFormsCore,
  JsonFormsI18nState,
  JsonFormsProps,
  JsonFormsRendererRegistryEntry,
  JsonFormsUISchemaRegistryEntry,
  JsonSchema,
  Middleware,
  OwnPropsOfJsonFormsRenderer,
  UISchemaElement,
  ValidationMode,
} from '@jsonforms/core';
import {
  JsonFormsStateProvider,
  withJsonFormsRendererProps,
} from './JsonFormsContext';

export interface JsonFormsReactProps {
  onChange?(state: Pick<JsonFormsCore, 'data' | 'errors'>): void;
  middleware?: Middleware;
}

export const JsonFormsDispatchRenderer = React.memo(
  function JsonFormsDispatchRenderer(props: JsonFormsProps) {
    // TODO: Should probably use React.useId() when support for React < 18 is dropped.
    const id = useMemo(nextId, [props.schema]);
    const testerContext = useMemo(
      () => ({
        rootSchema: props.rootSchema,
        config: props.config,
      }),
      [props.rootSchema, props.config]
    );
    const renderer = useMemo(
      () =>
        maxBy(props.renderers, (r) =>
          r.tester(props.uischema, props.schema, testerContext)
        ),
      [props.renderers, props.uischema, props.schema, testerContext]
    );
    if (
      renderer === undefined ||
      renderer.tester(props.uischema, props.schema, testerContext) === -1
    ) {
      return <UnknownRenderer type={'renderer'} />;
    } else {
      const Render = renderer.renderer;
      return (
        <Render
          uischema={props.uischema}
          schema={props.schema}
          path={props.path}
          enabled={props.enabled}
          renderers={props.renderers}
          cells={props.cells}
          id={id}
        />
      );
    }
  }
);

/**
 * @deprecated Since Version 3.0 this optimization renderer is no longer necessary.
 * Use `JsonFormsDispatch` instead.
 * We still export it for backward compatibility
 */
export const ResolvedJsonFormsDispatchRenderer = JsonFormsDispatchRenderer;

export const JsonFormsDispatch: ComponentType<OwnPropsOfJsonFormsRenderer> =
  withJsonFormsRendererProps(JsonFormsDispatchRenderer);

/**
 * @deprecated Since Version 3.0 this optimization component is no longer necessary.
 * Use `JsonFormsDispatch` instead.
 * We still export it for backward compatibility
 */
export const ResolvedJsonFormsDispatch: ComponentType<OwnPropsOfJsonFormsRenderer> =
  withJsonFormsRendererProps(ResolvedJsonFormsDispatchRenderer);

export interface JsonFormsInitStateProps {
  data: any;
  schema?: JsonSchema;
  uischema?: UISchemaElement;
  renderers: JsonFormsRendererRegistryEntry[];
  cells?: JsonFormsCellRendererRegistryEntry[];
  ajv?: Ajv;
  config?: any;
  uischemas?: JsonFormsUISchemaRegistryEntry[];
  readonly?: boolean;
  validationMode?: ValidationMode;
  i18n?: JsonFormsI18nState;
  additionalErrors?: ErrorObject[];
}

export const JsonForms = (
  props: JsonFormsInitStateProps & JsonFormsReactProps
) => {
  const {
    ajv,
    data,
    schema,
    uischema,
    renderers,
    cells,
    onChange,
    config,
    uischemas,
    readonly,
    validationMode,
    i18n,
    additionalErrors,
    middleware,
  } = props;
  const schemaToUse = useMemo(
    () => (schema !== undefined ? schema : Generate.jsonSchema(data)),
    [schema, data]
  );
  const uischemaToUse = useMemo(
    () =>
      typeof uischema === 'object'
        ? uischema
        : Generate.uiSchema(schemaToUse, undefined, undefined, schemaToUse),
    [uischema, schemaToUse]
  );

  return (
    <JsonFormsStateProvider
      initState={{
        core: {
          ajv,
          data,
          schema: schemaToUse,
          uischema: uischemaToUse,
          validationMode: validationMode,
          additionalErrors: additionalErrors,
        },
        config,
        uischemas,
        renderers,
        cells,
        readonly,
        i18n,
      }}
      onChange={onChange}
      middleware={middleware}
    >
      <JsonFormsDispatch />
    </JsonFormsStateProvider>
  );
};

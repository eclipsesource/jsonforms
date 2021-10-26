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
import React, { useMemo } from 'react';
import Ajv from 'ajv';
import { UnknownRenderer } from './UnknownRenderer';
import {
  createId,
  Generate,
  isControl,
  JsonFormsCellRendererRegistryEntry,
  JsonFormsCore,
  JsonFormsI18nState,
  JsonFormsProps,
  JsonFormsRendererRegistryEntry,
  JsonFormsUISchemaRegistryEntry,
  JsonSchema,
  OwnPropsOfJsonFormsRenderer,
  removeId,
  UISchemaElement,
  ValidationMode
} from '@jsonforms/core';
import {
  JsonFormsStateProvider,
  useJsonForms
} from './JsonFormsContext';

interface JsonFormsRendererState {
  id: string;
}

export interface JsonFormsReactProps {
  onChange?(state: Pick<JsonFormsCore, 'data' | 'errors'>): void;
}

export class JsonFormsDispatchRenderer extends React.Component<
  JsonFormsProps,
  JsonFormsRendererState
> {
  constructor(props: JsonFormsProps) {
    super(props);
    this.state = {
      id: isControl(props.uischema)
        ? createId(props.uischema.scope)
        : undefined,
    };
  }

  componentWillUnmount() {
    if (isControl(this.props.uischema)) {
      removeId(this.state.id);
    }
  }
  
  render() {
    const { schema, uischema, path, enabled, renderers, cells } = this.props as JsonFormsProps;

    return (
      <TestAndRender
        uischema={uischema}
        schema={schema}
        path={path}
        enabled={enabled}
        renderers={renderers}
        cells={cells}
        id={this.state.id}
      />
    );
  }
}

const TestAndRender = React.memo(
  (props: {
    uischema: UISchemaElement;
    schema: JsonSchema;
    path: string;
    enabled: boolean;
    renderers: JsonFormsRendererRegistryEntry[];
    cells: JsonFormsCellRendererRegistryEntry[];
    id: string;
  }) => {
    const renderer = useMemo(
      () => maxBy(props.renderers, r => r.tester(props.uischema, props.schema)),
      [props.renderers, props.uischema, props.schema]
    );
    if (
      renderer === undefined ||
      renderer.tester(props.uischema, props.schema) === -1
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
          id={props.id}
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
export class ResolvedJsonFormsDispatchRenderer extends JsonFormsDispatchRenderer {
  constructor(props: JsonFormsProps) {
    super(props);
  }
}

const useJsonFormsDispatchRendererProps = (props: OwnPropsOfJsonFormsRenderer & JsonFormsReactProps) => {
  const ctx = useJsonForms();

  return {
    schema: props.schema || ctx.core.schema,
    uischema: props.uischema || ctx.core.uischema,
    path: props.path || '',
    enabled: props.enabled,
    rootSchema: ctx.core.schema,
    renderers: props.renderers || ctx.renderers,
    cells: props.cells || ctx.cells,
  };
}

export const JsonFormsDispatch = React.memo(
  (props: OwnPropsOfJsonFormsRenderer & JsonFormsReactProps) => {
    const renderProps = useJsonFormsDispatchRendererProps(props);
    return <JsonFormsDispatchRenderer {...renderProps} />
  }
);

/**
 * @deprecated Since Version 3.0 this optimization component is no longer necessary.
 * Use `JsonFormsDispatch` instead.
 * We still export it for backward compatibility 
 */
export const ResolvedJsonFormsDispatch = React.memo(
  (props: OwnPropsOfJsonFormsRenderer & JsonFormsReactProps) => {
    const renderProps = useJsonFormsDispatchRendererProps(props);
    return <ResolvedJsonFormsDispatchRenderer {...renderProps} />
  }
);

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
    i18n
  } = props;
  const schemaToUse = useMemo(
    () => (schema !== undefined ? schema : Generate.jsonSchema(data)),
    [schema, data]
  );
  const uischemaToUse = useMemo(
    () =>
      typeof uischema === 'object' ? uischema : Generate.uiSchema(schemaToUse),
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
          validationMode: validationMode
        },
        config,
        uischemas,
        renderers,
        cells,
        readonly,
        i18n
      }}
      onChange={onChange}
    >
      <JsonFormsDispatch />
    </JsonFormsStateProvider>
  );
};
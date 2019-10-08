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
import React, { useLayoutEffect } from 'react';
import AJV from 'ajv';
import RefParser from 'json-schema-ref-parser';
import { UnknownRenderer } from './UnknownRenderer';
import {
  createId,
  isControl,
  JsonFormsCellRendererRegistryEntry,
  JsonFormsCore,
  JsonFormsProps,
  JsonFormsRendererRegistryEntry,
  JsonSchema,
  OwnPropsOfJsonFormsRenderer,
  refResolver,
  removeId,
  UISchemaElement,
} from '@jsonforms/core';
import {
  JsonFormsStateProvider,
  useJsonForms
} from './JsonFormsContext';
import isEqual from 'lodash/isEqual';
import { RefResolver } from './RefResolver';

interface JsonFormsRendererState {
  id: string;
  schema: JsonSchema;
  renderer: any;
}

export interface JsonFormsReactProps {
  onChange?(state: Pick<JsonFormsCore, 'data' | 'errors'>): void;
}

export class JsonFormsDispatchRenderer extends React.Component<
  JsonFormsProps,
  JsonFormsRendererState
  > {
  static getDerivedStateFromProps(
    nextProps: JsonFormsProps,
    prevState: JsonFormsRendererState
  ) {
    if (!isEqual(prevState.schema, nextProps.schema)) {
      const newState: JsonFormsRendererState = {
        id: prevState.id,
        renderer: undefined,
        schema: nextProps.schema
      };
      return newState;
    }

    return null;
  }

  mounted = false;

  constructor(props: JsonFormsProps) {
    super(props);
    this.state = {
      id: isControl(props.uischema)
        ? createId(props.uischema.scope)
        : undefined,
      schema: props.schema,
      renderer: undefined
    };
  }

  resolveRef = async (pointer: string) => {
    return refResolver(this.props.rootSchema, this.props.refParserOptions)(pointer);
  };

  componentDidMount() {
    if (this.props.renderers.length > 0) {
      this.findRenderer().then(testedRenderers => {
        const designatedRenderer = maxBy(testedRenderers, 'test');
        this.setState({
          renderer: designatedRenderer
        });
      });
    } else {
      this.setState({
        renderer: null
      });
    }
  }

  async findRenderer() {
    return Promise.all(
      this.props.renderers.map(r => {
        return r
          .tester(
            this.props.uischema,
            this.props.rootSchema,
            this.resolveRef
          )
          .then(result => {
            return {
              renderer: r.renderer,
              test: result
            };
          });
      })
    );
  }

  componentDidUpdate(prevProps: JsonFormsProps) {
    if (!isEqual(this.props, prevProps)) {
      if (this.props.renderers && this.props.renderers.length > 0) {
        this.findRenderer().then(testedRenderers => {
          const designatedRenderer = maxBy(testedRenderers, 'test');
          this.setState({
            renderer: designatedRenderer
          });
        });
      } else {
        this.setState({
          renderer: null
        });
      }
    }
  }

  componentWillUnmount() {
    this.mounted = false;
    if (isControl(this.props.uischema)) {
      removeId(this.state.id);
    }
  }

  render() {
    const { uischema, path, renderers } = this.props as JsonFormsProps;

    if (
      this.state.renderer === undefined ||
      this.state.renderer === null ||
      this.state.renderer.test === -1
    ) {
      return <UnknownRenderer type={'renderer'} />;
    } else if (isControl(this.props.uischema)) {
      return (
        <RefResolver
          schema={this.props.schema}
          pointer={this.props.uischema.scope}
          resolveRef={this.resolveRef}
        >
          {(resolvedSchema: any) => {
            const Render = this.state.renderer.renderer;
            return (
              <Render
                uischema={uischema}
                schema={resolvedSchema}
                path={path}
                renderers={renderers}
                id={this.state.id}
              />
            );
          }}
        </RefResolver>
      );
    } else {
      const Render = this.state.renderer.renderer;
      return (
        <Render
          uischema={uischema}
          schema={this.props.schema}
          path={path}
          renderers={renderers}
          id={this.state.id}
        />
      );
    }
  }
}

export const JsonFormsDispatch = React.memo(
  (props: OwnPropsOfJsonFormsRenderer & JsonFormsReactProps) => {
    const ctx = useJsonForms();
    const { data, errors } = ctx.core;
    useLayoutEffect(() => {
      props.onChange && props.onChange({ data, errors });
    }, [data, errors]);

    return (
      <JsonFormsDispatchRenderer
        schema={props.schema || ctx.core.schema}
        uischema={props.uischema || ctx.core.uischema}
        path={props.path || ''}
        rootSchema={ctx.core.schema}
        renderers={ctx.renderers}
        refParserOptions={ctx.core.refParserOptions}
      />
    );
  }
);
JsonFormsDispatch.displayName = 'JsonFormsDispatch';

export interface JsonFormsInitStateProps {
  data: any;
  schema: JsonSchema;
  uischema: UISchemaElement;
  renderers: JsonFormsRendererRegistryEntry[];
  cells?: JsonFormsCellRendererRegistryEntry[];
  ajv?: AJV.Ajv;
  refParserOptions?: RefParser.Options;
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
    refParserOptions,
    onChange
  } = props;
  return (
    <JsonFormsStateProvider
      initState={{
        core: {
          ajv,
          data,
          refParserOptions,
          schema,
          uischema,
          errors: [] // TODO
        },
        renderers,
        cells
      }}
    >
      <JsonFormsDispatch onChange={onChange} />
    </JsonFormsStateProvider>
  );
};

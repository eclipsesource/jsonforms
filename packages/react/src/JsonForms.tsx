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
import isEqual from 'lodash/isEqual';
import maxBy from 'lodash/maxBy';
import React, { useEffect } from 'react';
import AJV from 'ajv';
import RefParser from 'json-schema-ref-parser';
import { UnknownRenderer } from './UnknownRenderer';
import {
    createId,
    findRefs,
    isControl,
    JsonFormsProps,
    JsonFormsRendererRegistryEntry,
    JsonSchema,
    OwnPropsOfJsonFormsRenderer,
    removeId,
    UISchemaElement,
} from '@jsonforms/core';
import { ctxToJsonFormsDispatchProps, JsonFormsStateProvider, useJsonForms } from './JsonFormsContext';
import { ErrorObject } from 'ajv';

interface JsonFormsRendererState {
    id: string;
    schema: JsonSchema;
    resolving: boolean;
    resolvedSchema: JsonSchema;
}

interface JsonFormsReactProps {
  onChange?(state: {data: any,   errors?: ErrorObject[]}): void;
}

const hasRefs = (schema: JsonSchema): boolean => {
    if (schema !== undefined) {
        return Object.keys(findRefs(schema)).length > 0;
    }
    return false;
};

export class ResolvedJsonFormsDispatchRenderer
    extends React.Component<JsonFormsProps, JsonFormsRendererState> {

    static getDerivedStateFromProps(
        nextProps: JsonFormsProps,
        prevState: JsonFormsRendererState
    ) {

        if (!isEqual(prevState.schema, nextProps.schema)) {
            const schemaHasRefs: boolean = hasRefs(nextProps.schema);
            const newState: JsonFormsRendererState = {
                id: prevState.id,
                resolvedSchema: schemaHasRefs ? undefined : nextProps.schema,
                schema: nextProps.schema,
                resolving: schemaHasRefs,
            };
            return newState;
        }

        return null;
    }

    mounted = false;

    constructor(props: JsonFormsProps) {
        super(props);
        this.state = {
            id: isControl(props.uischema) ? createId(props.uischema.scope) : undefined,
            schema: props.schema,
            resolvedSchema: props.schema,
            resolving: false,
        };
    }

    componentDidMount() {
        if (this.state.resolving) {
            this.resolveAndUpdateSchema(this.props);
        }
    }

    componentDidUpdate() {
        if (this.state.resolving) {
            this.resolveAndUpdateSchema(this.props);
        }
    }

    resolveAndUpdateSchema = (props: JsonFormsProps) => {
        props.refResolver(props.schema).then((resolvedSchema: any) => {
            this.setState({
                resolving: false,
                resolvedSchema: resolvedSchema
            });
        });
    };

    componentWillUnmount() {
        this.mounted = false;
        if (isControl(this.props.uischema)) {
            removeId(this.state.id);
        }
    }

    render() {
        const { uischema, path, renderers } = this.props as JsonFormsProps;
        const { resolving } = this.state;
        const _schema = this.state.resolvedSchema;

        if (resolving) {
            return <div>Loading...</div>;
        }

        const renderer = maxBy(renderers, r => r.tester(uischema, _schema));
        if (renderer === undefined || renderer.tester(uischema, _schema) === -1) {
            return <UnknownRenderer type={'renderer'} />;
        } else {
            const Render = renderer.renderer;
            return (
                <Render
                    uischema={uischema}
                    schema={_schema}
                    path={path}
                    renderers={renderers}
                    id={this.state.id}
                />
            );
        }
    }
}

export class JsonFormsDispatchRenderer extends ResolvedJsonFormsDispatchRenderer {
    constructor(props: JsonFormsProps) {
        super(props);
        const isResolved = !hasRefs(props.schema);
        this.state = {
            ...this.state,
            resolvedSchema: isResolved ? props.schema : undefined,
            resolving: !isResolved,
        };
    }
}

export const JsonFormsDispatch = (props: OwnPropsOfJsonFormsRenderer & JsonFormsReactProps) => {
    const ctx = useJsonForms();
    const { refResolver } = ctxToJsonFormsDispatchProps(ctx, props);
    useEffect(() => {
      props.onChange && props.onChange({data: ctx.core.data, errors: ctx.core.errors})
    }, [ctx.core.data, ctx.core.errors])

    return (
        <JsonFormsDispatchRenderer
            schema={props.schema || ctx.core.schema}
            uischema={props.uischema || ctx.core.uischema}
            path={props.path || ''}
            rootSchema={ctx.core.schema}
            renderers={ctx.renderers}
            refResolver={refResolver}
        />
    );
};

export interface JsonFormsInitStateProps {
    data: any;
    schema: JsonSchema;
    uischema: UISchemaElement;
    renderers: JsonFormsRendererRegistryEntry[];
    ajv?: AJV.Ajv;
    refParserOptions?: RefParser.Options;
}

export const JsonForms = (props: JsonFormsInitStateProps & JsonFormsReactProps) => {
    const { ajv, data, schema, uischema, renderers, refParserOptions, onChange } = props;
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
                renderers
            }}
        >
            <JsonFormsDispatch onChange={onChange}/>
        </JsonFormsStateProvider>
    );
};

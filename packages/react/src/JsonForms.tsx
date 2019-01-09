/*
  The MIT License
  
  Copyright (c) 2018 EclipseSource Munich
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
import * as React from 'react';
import * as JsonRefs from 'json-refs';
import * as _ from 'lodash';
import { connect } from 'react-redux';
import { UnknownRenderer } from './UnknownRenderer';
import {
    createId,
    isControl,
    JsonFormsProps,
    JsonSchema,
    mapStateToJsonFormsRendererProps,
    removeId
} from '@jsonforms/core';

interface JsonFormsRendererState {
    id: string;
    schema: JsonSchema;
    resolving: boolean;
    resolvedSchema: JsonSchema;
}

const hasRefs = (schema: JsonSchema) => {
    if (schema !== undefined) {
        return Object.keys(JsonRefs.findRefs(schema)).length > 0;
    }
    return false;
};

export class ResolvedJsonFormsDispatchRenderer
    extends React.Component<JsonFormsProps, JsonFormsRendererState> {

    static getDerivedStateFromProps(
        nextProps: JsonFormsProps,
        prevState: JsonFormsRendererState
    ) {

        if (!_.isEqual(prevState.schema, nextProps.schema)) {
            const newState: JsonFormsRendererState = {
                id: prevState.id,
                resolvedSchema: undefined,
                schema: nextProps.schema,
                resolving: true,
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
            this.resolveAndUpdateSchema(this.props.schema);
        }
    }

    componentDidUpdate() {
        if (this.state.resolving) {
            this.resolveAndUpdateSchema(this.props.schema);
        }
    }

    resolveAndUpdateSchema = (schema: JsonSchema) => {
        JsonRefs
            .resolveRefs(schema)
            .then(resolvedSchema => {
                this.setState({
                    resolving: false,
                    resolvedSchema: resolvedSchema.resolved
                });
            });
    }

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

        const renderer = _.maxBy(renderers, r => r.tester(uischema, _schema));
        if (renderer === undefined || renderer.tester(uischema, _schema) === -1) {
            return <UnknownRenderer type={'renderer'}/>;
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

export const ResolvedJsonForms = connect(
    mapStateToJsonFormsRendererProps,
    null
)(ResolvedJsonFormsDispatchRenderer);

export class JsonFormsDispatchRenderer extends ResolvedJsonForms {
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

export const JsonForms = connect(
    mapStateToJsonFormsRendererProps,
    null
)(JsonFormsDispatchRenderer);

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
  mapStateToDispatchRendererProps,
  removeId
} from '@jsonforms/core';

interface JsonFormsDispatchRendererState {
  id: string;
  schema: JsonSchema;
}

class JsonFormsDispatchRenderer
  extends React.Component<JsonFormsProps, JsonFormsDispatchRendererState> {

  constructor(props) {
    super(props);
    if (isControl(props.uischema)) {
      this.state = {
          id: createId(props.uischema.scope),
          schema: undefined
    };
    } else {
        this.state = {
            id: undefined,
            schema: undefined
        };
    }
  }

  componentWillMount() {
      JsonRefs.resolveRefs(this.props.schema).then(resolveSchema => {
          this.setState({
              ...this.state,
              schema: resolveSchema.resolved
          });
      });
  }

  componentWillUnmount() {
    if (isControl(this.props.uischema)) {
      removeId(this.state.id);
    }
  }

  render() {
      const { uischema, path, renderers } = this.props as JsonFormsProps;
      const schema = this.state.schema;

      if (schema === undefined) {
          return null;
      }

      const renderer = _.maxBy(renderers, r => r.tester(uischema, schema));
      if (renderer === undefined || renderer.tester(uischema, schema) === -1) {
          return <UnknownRenderer type={'renderer'}/>;
      } else {
          const Render = renderer.renderer;
          return (
              <Render
                  uischema={uischema}
                  schema={schema}
                  path={path}
                  renderers={renderers}
                  id={this.state.id}
              />
          );
      }
  }
}

export const JsonForms = connect(
  mapStateToDispatchRendererProps,
  null
)(JsonFormsDispatchRenderer);

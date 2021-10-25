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
import React from 'react';
import {
  ArrayLayoutProps,
  computeLabel,
  createDefaultValue,
} from '@jsonforms/core';
import map from 'lodash/map';
import { ArrayLayoutToolbar } from './ArrayToolbar';
import ExpandPanelRenderer from './ExpandPanelRenderer';
import merge from 'lodash/merge';

interface MaterialArrayLayoutState {
  expanded: number | boolean;
}
export class MaterialArrayLayout extends React.PureComponent<
  ArrayLayoutProps,
  MaterialArrayLayoutState
> {
  state: MaterialArrayLayoutState = {
    expanded: null
  };
  innerCreateDefaultValue = () => createDefaultValue(this.props.schema);
  handleChange = (index: number) => (_event: any, expanded: boolean) => {
    this.setState({
      expanded: expanded ? index : false
    });
  };
  isExpanded = (index: number) =>
    this.state.expanded === index;
  render() {
    const {
      data,
      path,
      schema,
      uischema,
      errors,
      addItem,
      renderers,
      cells,
      label,
      required,
      rootSchema,
      config,
      uischemas
    } = this.props;
    const appliedUiSchemaOptions = merge(
      {},
      config,
      this.props.uischema.options
    );
    console.log("here");

    return (
      <div>
        <ArrayLayoutToolbar
          label={computeLabel(
            label,
            required,
            appliedUiSchemaOptions.hideRequiredAsterisk
          )}
          errors={errors}
          path={path}
          addItem={addItem}
          createDefault={this.innerCreateDefaultValue}
        />
        <div>
          {data > 0 ? (
            map(range(data), index => {
              return (
                <ExpandPanelRenderer
                  index={index}
                  expanded={this.isExpanded(index)}
                  schema={schema}
                  path={path}
                  handleExpansion={this.handleChange}
                  uischema={uischema}
                  renderers={renderers}
                  cells={cells}
                  key={index}
                  rootSchema={rootSchema}
                  enableMoveUp={index != 0}
                  enableMoveDown={index < data - 1}
                  config={config}
                  childLabelProp={appliedUiSchemaOptions.elementLabelProp}
                  uischemas={uischemas}
                />
              );
            })
          ) : (
            <p>No data</p>
          )}
        </div>
      </div>
    );
  }
}

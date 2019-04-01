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
import React from 'react';
import { connect } from 'react-redux';
import { Hidden, Step, StepButton, Stepper } from '@material-ui/core';
import {
  and,
  Categorization,
  categorizationHasCategory,
  Category,
  getData,
  isVisible,
  JsonFormsState,
  mapStateToLayoutProps,
  optionIs,
  RankedTester,
  rankWith,
  RendererProps,
  StatePropsOfLayout,
  StatePropsOfRenderer,
  uiTypeIs
} from '@jsonforms/core';
import { RendererComponent } from '@jsonforms/react';
import { MaterialLayoutRenderer, MaterialLayoutRendererProps } from '../util/layout';

export const materialCategorizationStepperTester: RankedTester = rankWith(
  2,
  and(
    uiTypeIs('Categorization'),
    categorizationHasCategory,
    optionIs('variant', 'stepper')
  )
);

export interface CategorizationStepperState {
  activeCategory: number;
}

export interface MaterialCategorizationStepperLayoutRendererProps extends StatePropsOfLayout {
  data: any;
}

export class MaterialCategorizationStepperLayoutRenderer
  extends RendererComponent<MaterialCategorizationStepperLayoutRendererProps & RendererProps, CategorizationStepperState> {

  state = {
    activeCategory: 0
  };

  handleStep = (step: number) => () => {
    this.setState({
      activeCategory: step,
    });
  };

  render() {
    const { data, uischema, schema, path, visible, renderers } = this.props;
    const categorization = uischema as Categorization;
    const { activeCategory } = this.state;

    const childProps: MaterialLayoutRendererProps = {
      elements: categorization.elements[activeCategory].elements,
      schema,
      path,
      direction: 'column',
      visible,
      renderers
    };

    const categories = categorization.elements
      .filter((category: Category) => isVisible(category, data));

    return (
      <Hidden xsUp={!visible}>
        <Stepper activeStep={activeCategory} nonLinear>
          {categories.map((e: Category, idx: number) =>
            (
              <Step key={e.label}>
                <StepButton onClick={this.handleStep(idx)}>
                  {e.label}
                </StepButton>
              </Step>
            ))
          }
        </Stepper>
        <div>
          <MaterialLayoutRenderer {...childProps} />
        </div>
      </Hidden>
    );
  }
}

const mapStateToCategorizationProps = (
  state: JsonFormsState,
  ownProps: StatePropsOfRenderer
): MaterialCategorizationStepperLayoutRendererProps & StatePropsOfLayout => {
  const props = mapStateToLayoutProps(state, ownProps);
  return {
    ...props,
    data: getData(state)
  };
};

export default connect(
  mapStateToCategorizationProps,
)(MaterialCategorizationStepperLayoutRenderer);

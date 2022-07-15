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
import React, {useState, useMemo} from 'react';
import merge from 'lodash/merge';
import { Button, Hidden, Step, StepButton, Stepper } from '@mui/material';
import {
  and,
  Categorization,
  categorizationHasCategory,
  Category,
  deriveLabelForUISchemaElement,
  isVisible,
  optionIs,
  RankedTester,
  rankWith,
  StatePropsOfLayout,
  uiTypeIs
} from '@jsonforms/core';
import { TranslateProps, withJsonFormsLayoutProps, withTranslateProps } from '@jsonforms/react';
import {
  AjvProps,
  MaterialLayoutRenderer,
  MaterialLayoutRendererProps,
  withAjvProps
} from '../util/layout';

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

export interface MaterialCategorizationStepperLayoutRendererProps
  extends StatePropsOfLayout, AjvProps, TranslateProps {
    data: any;
}

export const MaterialCategorizationStepperLayoutRenderer = (props: MaterialCategorizationStepperLayoutRendererProps)=> {
  const [activeCategory, setActiveCategory] = useState<number>(0);

  const handleStep = (step: number) => {
    setActiveCategory( step);
  };

  const {
    data,
    path,
    renderers,
    schema,
    uischema,
    visible,
    cells,
    config,
    ajv,
    t
  } = props;
  const categorization = uischema as Categorization;
  const appliedUiSchemaOptions = merge({}, config, uischema.options);
  const buttonWrapperStyle = {
    textAlign: 'right' as 'right',
    width: '100%',
    margin: '1em auto'
  };
  const buttonNextStyle = {
    float: 'right' as 'right'
  };
  const buttonStyle = {
    marginRight: '1em'
  };
  const categories = useMemo(() => categorization.elements.filter((category: Category) =>
    isVisible(category, data, undefined, ajv)
  ),[categorization, data, ajv]);
  const childProps: MaterialLayoutRendererProps = {
    elements: categories[activeCategory].elements,
    schema,
    path,
    direction: 'column',
    visible,
    renderers,
    cells
  };
  const tabLabels = useMemo(() => {
    return categories.map((e: Category) => 
      deriveLabelForUISchemaElement(e, t)
    )
  }, [categories, t])
  return (
    <Hidden xsUp={!visible}>
      <Stepper activeStep={activeCategory} nonLinear>
        {categories.map((_: Category, idx: number) => (
          <Step key={tabLabels[idx]}>
            <StepButton onClick={() => handleStep(idx)}>
              {tabLabels[idx]}
            </StepButton>
          </Step>
        ))}
      </Stepper>
      <div>
        <MaterialLayoutRenderer {...childProps} />
      </div>
      { !!appliedUiSchemaOptions.showNavButtons ? (<div style={buttonWrapperStyle}>
        <Button
          style={buttonNextStyle}
          variant="contained"
          color="primary"
          disabled={activeCategory >= categories.length - 1}
          onClick={() => handleStep(activeCategory + 1)}
        >
          Next
        </Button>
        <Button
          style={buttonStyle}
          color="secondary"
          variant="contained"
          disabled={activeCategory <= 0}
          onClick={() => handleStep(activeCategory - 1)}
        >
          Previous
        </Button>
      </div>) : (<></>)}
    </Hidden>
  );
};

export default withAjvProps(withTranslateProps(
  withJsonFormsLayoutProps(MaterialCategorizationStepperLayoutRenderer
)));

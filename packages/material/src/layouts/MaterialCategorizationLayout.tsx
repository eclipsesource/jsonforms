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
import { AppBar, Hidden, Tab, Tabs } from '@mui/material';
import {
  and,
  Categorization,
  Category,
  deriveLabelForUISchemaElement,
  isVisible,
  RankedTester,
  rankWith,
  StatePropsOfLayout,
  Tester,
  UISchemaElement,
  uiTypeIs
} from '@jsonforms/core';
import { TranslateProps, withJsonFormsLayoutProps, withTranslateProps } from '@jsonforms/react';
import {
  AjvProps,
  MaterialLayoutRenderer,
  MaterialLayoutRendererProps,
  withAjvProps
} from '../util/layout';

export const isSingleLevelCategorization: Tester = and(
  uiTypeIs('Categorization'),
  (uischema: UISchemaElement): boolean => {
    const categorization = uischema as Categorization;

    return (
      categorization.elements &&
      categorization.elements.reduce(
        (acc, e) => acc && e.type === 'Category',
        true
      )
    );
  }
);

export const materialCategorizationTester: RankedTester = rankWith(
  1,
  isSingleLevelCategorization
);
export interface CategorizationState {
  activeCategory: number;
}

export interface MaterialCategorizationLayoutRendererProps
  extends StatePropsOfLayout, AjvProps, TranslateProps {
  selected?: number;
  ownState?: boolean;
  data?: any;
  onChange?(selected: number, prevSelected: number): void;
}

export const MaterialCategorizationLayoutRenderer = (props: MaterialCategorizationLayoutRendererProps) => {
  const {
    data,
    path,
    renderers,
    cells,
    schema,
    uischema,
    visible,
    enabled,
    selected,
    onChange,
    ajv,
    t
  } = props;
  const categorization = uischema as Categorization;
  const [activeCategory, setActiveCategory]= useState<number|undefined>(selected??0);
  const categories = useMemo(() => categorization.elements.filter((category: Category) =>
    isVisible(category, data, undefined, ajv)
  ),[categorization, data, ajv]);
  const childProps: MaterialLayoutRendererProps = {
    elements: categories[activeCategory].elements,
    schema,
    path,
    direction: 'column',
    enabled,
    visible,
    renderers,
    cells
  };
  const onTabChange = (_event: any, value: any) => {
    if (onChange) {
      onChange(value, activeCategory);
    }
    setActiveCategory(value);
  };

  const tabLabels = useMemo(() => {
    return categories.map((e: Category) => 
      deriveLabelForUISchemaElement(e, t)
    )
  }, [categories, t])

  return (
    <Hidden xsUp={!visible}>
      <AppBar position='static'>
        <Tabs value={activeCategory} onChange={onTabChange} textColor='inherit' indicatorColor='secondary' variant='scrollable'>
          {categories.map((_, idx: number) => (
            <Tab key={idx} label={tabLabels[idx]} />
          ))}
        </Tabs>
      </AppBar>
      <div style={{ marginTop: '0.5em' }}>
        <MaterialLayoutRenderer {...childProps} />
      </div>
    </Hidden>
  );
};

export default withAjvProps(withTranslateProps(withJsonFormsLayoutProps(MaterialCategorizationLayoutRenderer)));

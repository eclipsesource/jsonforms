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
import React, { useState } from 'react';
import type { Categorization, Category, LayoutProps } from '@jsonforms/core';
import {
  TranslateProps,
  withJsonFormsLayoutProps,
  withTranslateProps,
} from '@jsonforms/react';
import { CategorizationList } from './CategorizationList';
import { SingleCategory } from './SingleCategory';
import { withAjvProps, withVanillaControlProps } from '../../util';
import type { AjvProps, VanillaRendererProps } from '../../util';

export interface CategorizationState {
  selectedCategory: Category;
}

interface CategorizationProps {
  selected?: number;
  onChange?(selected: number, prevSelected: number): void;
}

export const CategorizationRenderer = ({
  data,
  uischema,
  schema,
  path,
  selected,
  t,
  visible,
  getStyleAsClassName,
  onChange,
  ajv,
}: LayoutProps &
  VanillaRendererProps &
  TranslateProps &
  CategorizationProps &
  AjvProps) => {
  const categorization = uischema as Categorization;
  const elements = categorization.elements as (Category | Categorization)[];
  const classNames = getStyleAsClassName('categorization');
  const masterClassNames = getStyleAsClassName('categorization.master');
  const detailClassNames = getStyleAsClassName('categorization.detail');
  const subcategoriesClassName = getStyleAsClassName('category.subcategories');
  const groupClassName = getStyleAsClassName('category.group');

  const [previousCategorization, setPreviousCategorization] =
    useState<Categorization>(uischema as Categorization);
  const [activeCategory, setActiveCategory] = useState<number>(selected ?? 0);

  const safeCategory =
    activeCategory >= categorization.elements.length ? 0 : activeCategory;

  if (categorization !== previousCategorization) {
    setActiveCategory(0);
    setPreviousCategorization(categorization);
  }

  const onCategorySelected = (categoryIndex: number) => () => {
    if (onChange) {
      return onChange(categoryIndex, safeCategory);
    }
    return setActiveCategory(categoryIndex);
  };

  return (
    <div
      className={classNames}
      hidden={visible === null || visible === undefined ? false : !visible}
    >
      <div className={masterClassNames}>
        <CategorizationList
          elements={elements}
          selectedCategory={elements[safeCategory] as Category}
          data={data}
          ajv={ajv}
          depth={0}
          onSelect={onCategorySelected}
          subcategoriesClassName={subcategoriesClassName}
          groupClassName={groupClassName}
          t={t}
        />
      </div>
      <div className={detailClassNames}>
        <SingleCategory
          category={elements[safeCategory] as Category}
          schema={schema}
          path={path}
          key={safeCategory}
        />
      </div>
    </div>
  );
};

export default withAjvProps(
  withVanillaControlProps(
    withTranslateProps(withJsonFormsLayoutProps(CategorizationRenderer))
  )
);

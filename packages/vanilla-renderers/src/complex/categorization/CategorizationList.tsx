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
import React, { useMemo } from 'react';
import {
  Category,
  Categorization,
  deriveLabelForUISchemaElement,
  Translator,
  isVisible,
} from '@jsonforms/core';
import { isCategorization } from './tester';
import { AjvProps } from '../../util';

const getCategoryClassName = (
  category: Category,
  selectedCategory: Category
): string => (selectedCategory === category ? 'selected' : '');

export interface CategorizationProps {
  elements: (Category | Categorization)[];
  selectedCategory: Category;
  depth: number;
  data: any;
  onSelect: any;
  subcategoriesClassName: string;
  groupClassName: string;
  t: Translator;
}

export const CategorizationList = ({
  selectedCategory,
  elements,
  data,
  depth,
  onSelect,
  subcategoriesClassName,
  groupClassName,
  t,
  ajv,
}: CategorizationProps & AjvProps) => {
  const filteredElements = useMemo(() => {
    return elements.filter((category: Category | Categorization) =>
      isVisible(category, data, undefined, ajv)
    );
  }, [elements, data, ajv]);

  const categoryLabels = useMemo(
    () => filteredElements.map((cat) => deriveLabelForUISchemaElement(cat, t)),
    [filteredElements, t]
  );

  return (
    <ul className={subcategoriesClassName}>
      {filteredElements.map((category, idx) => {
        if (isCategorization(category)) {
          return (
            <li key={categoryLabels[idx]} className={groupClassName}>
              <span>{categoryLabels[idx]}</span>
              <CategorizationList
                selectedCategory={selectedCategory}
                elements={category.elements}
                data={data}
                ajv={ajv}
                depth={depth + 1}
                onSelect={onSelect}
                subcategoriesClassName={subcategoriesClassName}
                groupClassName={groupClassName}
                t={t}
              />
            </li>
          );
        } else {
          return (
            <li
              key={categoryLabels[idx]}
              onClick={onSelect(idx)}
              className={getCategoryClassName(category, selectedCategory)}
            >
              <span>{categoryLabels[idx]}</span>
            </li>
          );
        }
      })}
    </ul>
  );
};

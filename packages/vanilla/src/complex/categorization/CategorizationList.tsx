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
import { Categorization, Category } from '@jsonforms/core';
import { isCategorization } from './tester';

const getCategoryClassName = (category: Category, selectedCategory: Category): string =>
  selectedCategory === category ? 'selected' : '';

export interface CategorizationProps {
  categorization: Categorization;
  selectedCategory: Category;
  depth: number;
  onSelect: any;
  subcategoriesClassName: string;
  groupClassName: string;
}

export const CategorizationList  = (
  {
    categorization,
    selectedCategory,
    depth,
    onSelect,
    subcategoriesClassName,
    groupClassName
  }: CategorizationProps) =>
  (
    <ul className={subcategoriesClassName}>
      {
        categorization.elements.map(category => {
          if (isCategorization(category)) {
            return (
              <li
                key={category.label}
                className={groupClassName}
              >
                <span>{category.label}</span>
                <CategorizationList
                  categorization={category}
                  selectedCategory={selectedCategory}
                  depth={depth + 1}
                  onSelect={onSelect}
                  subcategoriesClassName={subcategoriesClassName}
                  groupClassName={groupClassName}
                />
              </li>
            );
          } else {
            return (
              <li
                key={category.label}
                onClick={onSelect(category)}
                className={getCategoryClassName(category, selectedCategory)}
              >
                <span>{category.label}</span>
              </li>
            );
          }
        })
      }
    </ul>
  );

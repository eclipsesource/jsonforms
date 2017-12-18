import * as React from 'react';
import {
  Categorization,
  Category,
  JsonForms
} from '@jsonforms/core';
import { isCategorization } from './tester';

const getCategoryClassName = (category: Category, selectedCategory: Category): string =>
  selectedCategory === category ? 'selected' : '';

export interface CategorizationProps {
  categorization: Categorization;
  selectedCategory: Category;
  depth: number;
  onSelect: any;
}

export const CategorizationList  = (
  { categorization, selectedCategory, depth, onSelect }: CategorizationProps
) =>
  (
    <ul className={JsonForms.stylingRegistry.getAsClassName('category.subcategories')}>
      {
        categorization.elements.map(category => {
          if (isCategorization(category)) {
            return (
              <li
                key={category.label}
                className={JsonForms.stylingRegistry.getAsClassName('category.group')}
              >
                <span>{category.label}</span>
                <CategorizationList
                  categorization={category}
                  selectedCategory={selectedCategory}
                  depth={depth + 1}
                  onSelect={onSelect}
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

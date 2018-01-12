import * as React from 'react';
import { Categorization, Category } from '@jsonforms/core';
import { isCategorization } from './tester';

const getCategoryClassName = (category: Category, selectedCategory: Category): string =>
  selectedCategory === category ? 'selected' : '';

export interface CategorizationProps {
  categorization: Categorization;
  selectedCategory: Category;
  depth: number;
  onSelect: any;
  subcategoriesClassName;
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

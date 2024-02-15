import { Categorization, Category } from '@jsonforms/core';

export type CategoryItem = {
  element: Category | Categorization;
  isEnabled: boolean;
  label?: string;
};

import * as _ from 'lodash';
import {
  and,
  Categorization,
  Category,
  RankedTester,
  rankWith,
  uiTypeIs
} from '@jsonforms/core';

export const isCategorization = (category: Category | Categorization): category is Categorization =>
  category.type === 'Categorization';

export const categorizationTester: RankedTester = rankWith(
  1,
  and(
    uiTypeIs('Categorization'),
    uischema => {
      const hasCategory = (element: Categorization): boolean => {
        if (_.isEmpty(element.elements)) {
          return false;
        }

        return element.elements
          .map(elem => isCategorization(elem) ?
            hasCategory(elem) :
            elem.type === 'Category'
          )
          .reduce((prev, curr) => prev && curr, true);
      };

      return hasCategory(uischema as Categorization);
    }
  ));

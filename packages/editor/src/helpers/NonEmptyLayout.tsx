import {
  Layout,
  mapStateToLayoutProps,
  RankedTester,
  rankWith,
  RendererProps,
  Tester,
} from '@jsonforms/core';
import { connectToJsonForms } from '@jsonforms/react';
import * as _ from 'lodash';

/**
 * Checks whether the given UI schema contains only label field or not.
 */
export const isInstanceOfLayout: Tester =
  (uischema: Layout): boolean => {
      if (_.isEmpty(uischema)) {
        return false;
      }
      if (!uischema.hasOwnProperty('elements')) {
        return false;
      }
      return _.isEmpty(uischema.elements) ||
        (
             uischema.elements.length === 1 &&
             _.some(uischema.elements, element => element.type === 'Label')
        );
    };
/**
 * Tester for empty layouts
 * @type {RankedTester}
 */
export const nonEmptyLayoutTester: RankedTester =
  rankWith(3, isInstanceOfLayout);

/**
 * NonEmptyLayoutRenderer is a custom layout renderer to prevent rendering empty layouts
 *
 * @returns null
 * @constructor
 */
export const NonEmptyLayoutRenderer = (
  {}: RendererProps) => {
  return null;
};

export default connectToJsonForms(
  mapStateToLayoutProps
)(NonEmptyLayoutRenderer);

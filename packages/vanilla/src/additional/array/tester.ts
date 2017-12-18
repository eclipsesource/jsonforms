import * as _ from 'lodash';
import { RankedTester, Test } from '@jsonforms/core';

const {
  and,
  rankWith,
  schemaMatches,
  schemaSubPathMatches,
  uiTypeIs
} = Test;

/**
 * Default tester for an array control.
 * @type {RankedTester}
 */
export const arrayTester: RankedTester = rankWith(12, and(
  uiTypeIs('Control'),
  schemaMatches(schema =>
    !_.isEmpty(schema)
    && schema.type === 'array'
    && !_.isEmpty(schema.items)
    && !Array.isArray(schema.items) // we don't care about tuples
  ),
  schemaSubPathMatches('items', schema =>
    schema.type === 'object'
  ))
);

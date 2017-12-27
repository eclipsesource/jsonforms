/**
 * Default tester for a master-detail layout.
 * @type {RankedTester}
 */
import { MasterDetailLayout, RankedTester, Test } from '@jsonforms/core';

const {
  rankWith,
  and,
  uiTypeIs,
} = Test;

export const treeMasterDetailTester: RankedTester =
  rankWith(
    2,
    and(
      uiTypeIs('MasterDetailLayout'),
      uischema => {
        const control = uischema as MasterDetailLayout;
        if (control.scope === undefined || control.scope === null) {
          return false;
        }

        return !(control.scope.$ref === undefined || control.scope.$ref === null);
      }
    )
  );

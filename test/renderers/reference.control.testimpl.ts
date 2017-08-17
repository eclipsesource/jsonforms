import { ReferenceControl } from '../../src/renderers/controls/reference.control';
// import { and, RankedTester, rankWith, schemaTypeIs, uiTypeIs } from '../../src/core/testers';
// import { JsonFormsRenderer } from '../../src/renderers/renderer.util';

// export const booleanControlTester: RankedTester = rankWith(2, and(
//     uiTypeIs('Control'),
//     schemaTypeIs('boolean')
//   ));
//
// /**
//  * Default boolean control.
//  */
// @JsonFormsRenderer({
//   selector: 'jsonforms-boolean',
//   tester: booleanControlTester
// })
export class ReferenceControlTestImpl extends ReferenceControl {
  private rootData: Object;
  private labelProperty: string;

  constructor(rootData: Object, labelProperty: string) {
    super();
    this.rootData = rootData;
    this.labelProperty = labelProperty;
  }

  protected getLabelProperty(): string {
    return this.labelProperty;
  }
}

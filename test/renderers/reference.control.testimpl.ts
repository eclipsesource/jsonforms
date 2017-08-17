import { ReferenceControl } from '../../src/renderers/controls/reference.control';

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

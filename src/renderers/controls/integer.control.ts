import { and, RankedTester, rankWith, schemaTypeIs, uiTypeIs } from '../../core/testers';
import { JsonFormsRenderer } from '../renderer.util';
import { BaseControl } from './base.control';

/**
 * Default tester for integer controls.
 * @type {RankedTester}
 */
export const integerControlTester: RankedTester = rankWith(2, and(
    uiTypeIs('Control'),
    schemaTypeIs('integer')
  ));

/**
 * Default integer control.
 */
@JsonFormsRenderer({
  selector: 'jsonforms-integer',
  tester: integerControlTester
})
export class IntegerControl extends BaseControl<HTMLInputElement> {

  /**
   * @inheritDoc
   */
  protected configureInput(input: HTMLInputElement): void {
    input.type = 'number';
    input.step = '1';
  }

  /**
   * @inheritDoc
   */
  protected get valueProperty(): string {
    return 'valueAsNumber';
  }

  /**
   * @inheritDoc
   */
  protected get inputChangeProperty(): string {
    return 'oninput';
  }

  /**
   * @inheritDoc
   */
  protected createInputElement(): HTMLInputElement {
    return document.createElement('input');
  }

  /**
   * @inheritDoc
   */
  protected convertModelValue(value: any): any {
    return value === undefined || value === null ? undefined : value;
  }
}

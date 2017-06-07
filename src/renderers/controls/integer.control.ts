import { BaseControl } from './base.control';
import { JsonFormsRenderer } from '../renderer.util';
import { rankWith, uiTypeIs, and, schemaTypeIs, RankedTester } from '../../core/testers';

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
    input.classList.add('form-control');
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
  protected get inputElement(): HTMLInputElement {
    return document.createElement('input');
  }

  /**
   * @inheritDoc
   */
  protected convertModelValue(value: any): any {
    return value === undefined || value === null ? undefined : value;
  }
}

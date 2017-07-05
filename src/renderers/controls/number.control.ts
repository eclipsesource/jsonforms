import {and, RankedTester, rankWith, schemaTypeIs, uiTypeIs} from '../../core/testers';
import {BaseControl} from './base.control';
import {JsonFormsRenderer} from '../renderer.util';

/**
 * Default tester for number controls.
 * @type {RankedTester}
 */
export const numberControlTester: RankedTester = rankWith(2, and(
    uiTypeIs('Control'),
    schemaTypeIs('number')
  ));

/**
 * Default number control.
 */
@JsonFormsRenderer({
  selector: 'jsonforms-number',
  tester: numberControlTester
})
export class NumberControl extends BaseControl<HTMLInputElement> {
  protected configureInput(input: HTMLInputElement): void {
    input.type = 'number';
    input.step = '0.1';
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

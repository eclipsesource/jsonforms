import { and, formatIs, RankedTester, rankWith, uiTypeIs } from '../../core/testers';
import { JsonFormsRenderer } from '../renderer.util';
import { BaseControl } from './base.control';

/**
 * Default tester for date controls.
 * @type {RankedTester}
 */
export const dateControlTester: RankedTester = rankWith(2, and(
    uiTypeIs('Control'),
    formatIs('date')
  ));

/**
 * Default date control.
 */
@JsonFormsRenderer({
  selector: 'jsonforms-date',
  tester: dateControlTester
})
export class DateControl extends BaseControl<HTMLInputElement> {

  /**
   * @inheritDoc
   */
  protected configureInput(input: HTMLInputElement): void {
    input.type = 'date';
    input.classList.add('form-control');
  }

  /**
   * @inheritDoc
   */
  protected get valueProperty(): string {
    return 'valueAsDate';
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
  protected convertModelValue(value: any): any {
    return new Date(value as string);
  }

  /**
   * @inheritDoc
   */
  protected convertInputValue(value: any): any {
    if (value === null || value === undefined) {
      return undefined;
    }

    return (value as Date).toISOString().substr(0, 10);
  }

  /**
   * @inheritDoc
   */
  protected createInputElement(): HTMLInputElement {
    return document.createElement('input');
  }
}

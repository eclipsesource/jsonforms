import { BaseControl } from './base.control';
import { JsonFormsRenderer } from '../renderer.util';
import {and, uiTypeIs, schemaTypeIs, rankWith, RankedTester} from '../../core/testers';

/**
 * Default tester for boolean controls.
 * @type {RankedTester}
 */
export const booleanControlTester: RankedTester = rankWith(2, and(
    uiTypeIs('Control'),
    schemaTypeIs('boolean')
  ));

/**
 * Default boolean control.
 */
@JsonFormsRenderer({
  selector: 'jsonforms-boolean',
  tester: booleanControlTester
})
export class BooleanControl extends BaseControl<HTMLInputElement> {
  protected configureInput(input: HTMLInputElement): void {
    input.type = 'checkbox';
  }
  protected get valueProperty(): string {
    return 'checked';
  }
  protected get inputChangeProperty(): string {
    return 'onchange';
  }
  protected get inputElement(): HTMLInputElement {
    return document.createElement('input');
  }
}

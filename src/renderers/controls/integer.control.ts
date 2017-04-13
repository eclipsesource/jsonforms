import { BaseControl } from './base.control';
import { JsonFormsRenderer } from '../renderer.util';
import { rankWith, uiTypeIs, and, schemaTypeIs, RankedTester } from '../../core/testers';

export const integerControlTester: RankedTester = rankWith(2, and(
    uiTypeIs('Control'),
    schemaTypeIs('integer')
  ));
@JsonFormsRenderer({
  selector: 'jsonforms-integer',
  tester: integerControlTester
})
export class IntegerControl extends BaseControl<HTMLInputElement> {
  protected configureInput(input: HTMLInputElement): void {
    input.type = 'number';
    input.step = '1';
    input.classList.add('form-control');
  }
  protected get valueProperty(): string {
    return 'valueAsNumber';
  }
  protected get inputChangeProperty(): string {
    return 'oninput';
  }
  protected get inputElement(): HTMLInputElement {
    return document.createElement('input');
  }
}

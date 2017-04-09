import { BaseControl } from './base.control';
import { JsonFormsRenderer } from '../renderer.util';
import { uiTypeIs, rankWith, RankedTester } from '../../core/testers';

export const textControlTester: RankedTester = rankWith(1, uiTypeIs('Control'));

@JsonFormsRenderer({
  selector: 'jsonforms-text',
  tester: textControlTester
})
export class TextControl extends BaseControl<HTMLInputElement> {
  protected configureInput(input: HTMLInputElement): void {
    input.type = 'text';
    input.classList.add('form-control');
  }
  protected get valueProperty(): string {
    return 'value';
  }
  protected get inputChangeProperty(): string {
    return 'oninput';
  }
  protected convertModelValue(value: any): any {
    return value === undefined ? '' : value;
  }
  protected get inputElement(): HTMLInputElement {
    return document.createElement('input');
  }
}

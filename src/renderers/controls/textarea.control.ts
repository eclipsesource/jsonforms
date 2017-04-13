import { BaseControl } from './base.control';
import { JsonFormsRenderer } from '../renderer.util';
import { rankWith, and, uiTypeIs, optionIs, RankedTester } from '../../core/testers';

export const textAreaControlTester: RankedTester = rankWith(2, and(
    uiTypeIs('Control'),
    optionIs('multi', true)
  ));
@JsonFormsRenderer({
  selector: 'jsonforms-textarea',
  tester: textAreaControlTester
})
export class TextAreaControl extends BaseControl<HTMLTextAreaElement> {
  protected configureInput(input: HTMLTextAreaElement): void {
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
  protected get inputElement(): HTMLTextAreaElement {
    return document.createElement('textarea');
  }
}

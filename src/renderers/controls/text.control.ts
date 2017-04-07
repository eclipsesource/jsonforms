import { UISchemaElement } from '../../models/uischema';
import { BaseControl } from './base.control';
import { JsonFormsRenderer } from '../renderer.util';

export const TextControlTester = (uischema: UISchemaElement) =>
  uischema !== undefined && uischema !== null && uischema.type === 'Control' ? 1 : -1;
@JsonFormsRenderer({
  selector: 'jsonforms-text',
  tester: TextControlTester
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

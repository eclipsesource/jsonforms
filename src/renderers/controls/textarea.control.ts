import { UISchemaElement } from '../../models/uischema';
import { BaseControl } from './base.control';
import { JsonFormsRenderer } from '../renderer.util';

@JsonFormsRenderer({
  selector: 'jsonforms-textarea',
  tester: (uischema: UISchemaElement) => uischema.type === 'Control' &&
  uischema.hasOwnProperty('options') &&
  uischema.options.hasOwnProperty('multi') &&
  uischema.options.multi === true ? 2 : -1
})
class TextAreaControl extends BaseControl<HTMLTextAreaElement> {
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

import { BaseControl } from './base.control';
import { JsonFormsRenderer } from '../renderer.util';
import {and, uiTypeIs, rankWith, formatIs} from '../../core/testers';

@JsonFormsRenderer({
  selector: 'jsonforms-date',
  tester: rankWith(2, and(
      uiTypeIs('Control'),
      formatIs('date')
  ))
})
class DateControl extends BaseControl<HTMLInputElement> {
  protected configureInput(input: HTMLInputElement): void {
    input.type = 'date';
    input.classList.add('form-control');
  }
  protected get valueProperty(): string {
    return 'valueAsDate';
  }
  protected get inputChangeProperty(): string {
    return 'oninput';
  }
  protected convertModelValue(value: any): any {
    return new Date(<string> value);
  }
  protected convertInputValue(value: any): any {
    if (value === null) {
      return undefined;
    }
    return (<Date>value).toISOString().substr(0, 10);
  }
  protected get inputElement(): HTMLInputElement {
    return document.createElement('input');
  }
}

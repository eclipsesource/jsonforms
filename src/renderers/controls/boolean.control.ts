import { BaseControl } from './base.control';
import { JsonFormsRenderer } from '../renderer.util';
import {and, uiTypeIs, schemaTypeIs, rankWith} from '../../core/testers';

@JsonFormsRenderer({
  selector: 'jsonforms-boolean',
  tester: rankWith(2, and(
      uiTypeIs('Control'),
      schemaTypeIs('boolean')
  ))
})
class BooleanControl extends BaseControl<HTMLInputElement> {
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

import { ControlElement } from '../../models/uischema';
import { BaseControl } from './base.control';
import { JsonFormsRenderer } from '../renderer.util';
import { resolveSchema } from '../../path.util';
import { rankWith, and, uiTypeIs, schemaMatches} from '../../core/testers';

@JsonFormsRenderer({
  selector: 'jsonforms-enum',
  tester: rankWith(2,
      and(
          uiTypeIs('Control'),
          schemaMatches(schema => schema.hasOwnProperty('enum'))
      )
  )
})
class EnumControl extends BaseControl<HTMLSelectElement> {
  private options: Array<any>;
  protected configureInput(input: HTMLSelectElement): void {
    this.options = resolveSchema(this.dataSchema, (<ControlElement>this.uischema).scope.$ref).enum;
    this.options.forEach(optionValue => {
      const option = document.createElement('option');
      option.value = optionValue;
      option.label = optionValue;
      input.appendChild(option);
    });
    input.classList.add('form-control');
  }
  protected get valueProperty(): string {
    return 'value';
  }
  protected get inputChangeProperty(): string {
    return 'onchange';
  }
  protected get inputElement(): HTMLSelectElement {
    return document.createElement('select');
  }
}

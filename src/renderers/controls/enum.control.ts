import { UISchemaElement, ControlElement } from '../../models/uischema';
import { JsonSchema } from '../../models/jsonSchema';
import { BaseControl } from './base.control';
import { JsonFormsRenderer } from '../renderer.util';
import { resolveSchema } from '../../path.util';

@JsonFormsRenderer({
  selector: 'jsonforms-enum',
  tester: (uischema: UISchemaElement, schema: JsonSchema) =>
      uischema.type === 'Control' &&
      resolveSchema(schema, (<ControlElement>uischema).scope.$ref).hasOwnProperty('enum') ? 2 : -1
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

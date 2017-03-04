import { UISchemaElement, ControlElement } from '../../models/uischema';
import { JsonSchema } from '../../models/jsonSchema';
import { BaseControl } from './base.control';
import { JsonFormsRenderer } from '../renderer.util';
import { resolveSchema } from '../../path.util';

@JsonFormsRenderer({
  selector: 'jsonforms-date',
  tester: (uischema: UISchemaElement, schema: JsonSchema) => {
    if (uischema.type !== 'Control') {
      return -1;
    }
    const localSchema = resolveSchema(schema, (<ControlElement>uischema).scope.$ref);
    if (localSchema.type === 'string' && localSchema.format === 'date') {
      return 2;
    }
    return -1;
  }
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

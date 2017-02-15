import { UISchemaElement, ControlElement } from '../../models/uischema';
import { JsonSchema } from '../../models/jsonSchema';
import { BaseControl } from './base.control';
import { JsonFormsRenderer } from '../renderer.util';
import { resolveSchema } from '../../path.util';

@JsonFormsRenderer({
  selector: 'jsonforms-boolean',
  tester: (uischema: UISchemaElement, schema: JsonSchema) =>
      uischema.type === 'Control'
      && resolveSchema(schema, (<ControlElement>uischema).scope.$ref).type === 'boolean' ? 2 : -1
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

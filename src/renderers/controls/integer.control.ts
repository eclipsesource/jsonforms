import { UISchemaElement, ControlElement } from '../../models/uischema';
import { JsonSchema } from '../../models/jsonSchema';
import { BaseControl } from './base.control';
import { JsonFormsRenderer } from '../renderer.util';
import { resolveSchema } from '../../path.util';

@JsonFormsRenderer({
  selector: 'jsonforms-integer',
  tester: (uischema: UISchemaElement, schema: JsonSchema) =>
      uischema.type === 'Control'
      && resolveSchema(schema, (<ControlElement>uischema).scope.$ref).type === 'integer' ? 2 : -1
})
class IntegerControl extends BaseControl<HTMLInputElement> {
  protected configureInput(input: HTMLInputElement): void {
    input.type = 'number';
    input.step = '1';
    input.classList.add('form-control');
  }
  protected get valueProperty(): string {
    return 'valueAsNumber';
  }
  protected get inputChangeProperty(): string {
    return 'oninput';
  }
  protected get inputElement(): HTMLInputElement {
    return document.createElement('input');
  }
}

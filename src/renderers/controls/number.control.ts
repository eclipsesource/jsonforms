import { UISchemaElement, ControlElement } from '../../models/uischema';
import { JsonSchema } from '../../models/jsonSchema';
import { BaseControl } from './base.control';
import { JsonFormsRenderer } from '../renderer.util';
import { resolveSchema } from '../../path.util';

@JsonFormsRenderer({
  selector: 'jsonforms-number',
  tester: (uischema: UISchemaElement, schema: JsonSchema) =>
      uischema.type === 'Control'
      && resolveSchema(schema, (<ControlElement>uischema).scope.$ref).type === 'number' ? 2 : -1
})
class NumberControl extends BaseControl<HTMLInputElement> {
  protected configureInput(input: HTMLInputElement): void {
    input.type = 'number';
    input.step = '0.1';
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

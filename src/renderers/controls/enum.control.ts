import { ControlElement } from '../../models/uischema';
import { BaseControl } from './base.control';
import { JsonFormsRenderer } from '../renderer.util';
import { resolveSchema } from '../../path.util';
import { rankWith, and, uiTypeIs, schemaMatches, RankedTester} from '../../core/testers';
import {isItemModel, ItemModel} from '../../parser/item_model';

export const enumControlTester: RankedTester = rankWith(2, and(
    uiTypeIs('Control'),
    schemaMatches(model => isItemModel(model) ? model.schema.hasOwnProperty('enum') : false)
  ));
@JsonFormsRenderer({
  selector: 'jsonforms-enum',
  tester: enumControlTester
})
export class EnumControl extends BaseControl<HTMLSelectElement> {
  private options: Array<any>;
  protected configureInput(input: HTMLSelectElement): void {
    this.options = (<ItemModel>
      resolveSchema(this.dataModel, (<ControlElement>this.uischema).scope.$ref)).schema.enum;
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
  protected convertModelValue(value: any): any {
    return (value === undefined || value === null) ? undefined : value;
  }
}

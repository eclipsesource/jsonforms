import { and, RankedTester, rankWith, schemaMatches, uiTypeIs } from '../../core/testers';
import { ControlElement } from '../../models/uischema';
import { resolveSchema } from '../../path.util';
import { JsonFormsRenderer } from '../renderer.util';
import { BaseControl } from './base.control';

/**
 * Default tester for enum controls.
 * @type {RankedTester}
 */
export const enumControlTester: RankedTester = rankWith(2, and(
    uiTypeIs('Control'),
    schemaMatches(schema => schema.hasOwnProperty('enum'))
  ));

/**
 * Default enum control.
 */
@JsonFormsRenderer({
  selector: 'jsonforms-enum',
  tester: enumControlTester
})
export class EnumControl extends BaseControl<HTMLSelectElement> {
  private options: any[];

  /**
   * @inheritDoc
   */
  protected configureInput(input: HTMLSelectElement): void {
    this.options = resolveSchema(
        this.dataSchema,
        (this.uischema as ControlElement).scope.$ref
    ).enum;
    this.options.forEach(optionValue => {
      const option = document.createElement('option');
      option.value = optionValue;
      option.label = optionValue;
      input.appendChild(option);
    });
  }

  /**
   * @inheritDoc
   */
  protected get valueProperty(): string {
    return 'value';
  }

  /**
   * @inheritDoc
   */
  protected get inputChangeProperty(): string {
    return 'onchange';
  }

  /**
   * @inheritDoc
   */
  protected createInputElement(): HTMLSelectElement {
    return document.createElement('select');
  }

  /**
   * @inheritDoc
   */
  protected convertModelValue(value: any): any {
    return (value === undefined || value === null) ? undefined : value;
  }
}

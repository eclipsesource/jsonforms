import { and, RankedTester, rankWith, schemaTypeIs, uiTypeIs } from '../../core/testers';
import { JsonFormsRenderer } from '../renderer.util';
import { BaseControl } from './base.control';
import { JsonForms } from '../../core';
import { ControlElement } from '../../models/uischema';

/**
 * Default tester for boolean controls.
 * @type {RankedTester}
 */
export const booleanControlTester: RankedTester = rankWith(2, and(
    uiTypeIs('Control'),
    schemaTypeIs('boolean')
  ));

/**
 * Default boolean control.
 */
@JsonFormsRenderer({
  selector: 'jsonforms-boolean',
  tester: booleanControlTester
})
export class BooleanControl extends BaseControl<HTMLInputElement> {

  render(): HTMLElement {
    const controlElement = this.uischema as ControlElement;
    this.createInput(controlElement);
    this.createLabel(controlElement);
    this.label.className = JsonForms.stylingRegistry.getAsClassName('control.label');
    this.input.className = JsonForms.stylingRegistry.getAsClassName('control.input');
    this.errorElement = document.createElement('div');
    this.errorElement.className = JsonForms.stylingRegistry.getAsClassName('control.validation');
    this.appendChild(this.input);
    this.appendChild(this.label);
    this.appendChild(this.errorElement);
    this.className = JsonForms.stylingRegistry.getAsClassName('control');
    this.classList.add(this.convertToClassName(controlElement.scope.$ref));

    return this;
  }
  protected configureInput(input: HTMLInputElement): void {
    input.type = 'checkbox';
  }
  protected get valueProperty(): string {
    return 'checked';
  }
  protected get inputChangeProperty(): string {
    return 'onchange';
  }
  protected createInputElement(): HTMLInputElement {
    return document.createElement('input');
  }

}

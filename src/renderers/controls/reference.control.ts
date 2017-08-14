import * as _ from 'lodash';

import { JsonForms } from '../../core';
import { BaseControl } from './base.control';
import { ReferenceProperty } from '../../core/schema.service';

/**
 * Abstract class that can be extended to get a single reference renderer.
 * Thereby the implementing client needs to provide the root data object
 * and the name of the property containing the label of possible
 * reference targets.
 */
export abstract class ReferenceControl extends BaseControl<HTMLSelectElement> {

  protected configureInput(input: HTMLSelectElement): void {
    this.addOptions(input);
  }

  protected get valueProperty(): string {
    return 'value';
  }

  protected get inputChangeProperty(): string {
    return 'onchange';
  }

  protected createInputElement(): HTMLSelectElement {
    return document.createElement('select');
  }

  protected convertModelValue(value: any): any {
    return (value === undefined || value === null) ? undefined : value.toString();
  }

  /**
   * Overwrite to provide the root data object which contains the possible reference targets.
   *
   * @return The root data object containing the possible reference targets.
   */
  protected abstract getRootData(): Object;

  /**
   * Overwrite to provide the property that contains the label to display for
   * possible reference targets.
   *
   * @return The name of the label property
   */
  protected abstract getLabelProperty(): string;

  /**
   * @return The name of the property that identifies a referencable data object.
   */
  protected getIdentifyingProperty(): string {
    return JsonForms.config.getIdentifyingProp();
  }

  /**
   * Adds all possible reference targets as options to the control's combo box.
   */
  protected addOptions(input) {
    const eReferenceSchema = this.dataSchema;
    const eTypeRefProp: ReferenceProperty =
      _.head(JsonForms.schemaService.getReferenceProperties(eReferenceSchema));

    const referencees = eTypeRefProp.findReferenceTargets(this.getRootData());

    referencees.forEach((referencee, index) => {
      const option = document.createElement('option');
      option.value = referencee[this.getIdentifyingProperty()];
      option.label = referencee[this.getLabelProperty()];
      option.innerText = referencee[this.getLabelProperty()];
      input.appendChild(option);
    });

    input.classList.add('form-control');
  }
}

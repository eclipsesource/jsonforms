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
   * Returns the root data object that contains the possible reference targets.
   * Might be overwritten to provide the root data object in another way
   * than from the static JsonForms object.
   *
   * @return The root data object containing the possible reference targets.
   */
  protected getRootData(): Object {
    return JsonForms.rootData;
  }

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
   * Returns the label of the default option.
   * Might be overwritten by implementing classes to change the label.
   *
   * @return the label of the default option.
   */
  protected getDefaultOptionLabel(): string {
    return 'Choose Reference Target...';
  }

  /**
   * Adds all possible reference targets as options to the control's combo box.
   */
  protected addOptions(input) {
    // The object schema contains the reference property rendered by this renderer
    // as one of its properties.
    const objectSchema = this.dataSchema;
    const referenceProperty: ReferenceProperty =
      _.head(JsonForms.schemaService.getReferenceProperties(objectSchema));

    const referencees = referenceProperty.findReferenceTargets(this.getRootData());

    // add default option which is displayed if no reference target has been selected
    const defaultOption = document.createElement('option');
    defaultOption.selected = true;
    defaultOption.disabled = true;
    defaultOption.hidden = true;
    defaultOption.innerText = this.getDefaultOptionLabel();
    input.appendChild(defaultOption);

    // add an option for every possible reference target
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

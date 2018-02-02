import * as _ from 'lodash';

import { ControlElement, LabelDescription } from '../models/uischema';

const deriveLabel = (controlElement: ControlElement): string => {

  if (controlElement.scope !== undefined) {
    const ref = controlElement.scope;
    const label = ref.substr(ref.lastIndexOf('/') + 1);

    return _.startCase(label);
  }

  return '';
};
/**
 * Return a label object based on the given control element.
 * @param {ControlElement} withLabel the UI schema to obtain a label object for
 * @returns {LabelDescription}
 */
export const createLabelDescriptionFrom = (withLabel: ControlElement): LabelDescription => {
  const labelProperty = withLabel.label;
  const derivedLabel = deriveLabel(withLabel);
  if (typeof labelProperty === 'boolean') {
    if (labelProperty) {
      return {
        text: derivedLabel,
        show: labelProperty
      };
    } else {
      return {
        text: derivedLabel,
        show: labelProperty as boolean
      };
    }
  } else if (typeof labelProperty === 'string') {
    return {
      text: labelProperty as string,
      show: true
    };
  } else if (typeof labelProperty === 'object') {
    const show = labelProperty.hasOwnProperty('show') ? labelProperty.show : true;
    const label = labelProperty.hasOwnProperty('text') ?
      labelProperty.text : derivedLabel;

    return {
      text: label,
      show
    };
  } else {
    return {
      text: derivedLabel,
      show: true
    };
  }
};


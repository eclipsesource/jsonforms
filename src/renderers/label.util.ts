import * as _ from 'lodash';

import { JsonSchema } from '../models/jsonSchema';
import { ControlElement, ILabelObject } from '../models/uischema';

class LabelObject implements ILabelObject {
    public text: string;
    public show: boolean;

    constructor(text: string, show: boolean) {
        this.text = text;
        this.show = show;
    }
}

const deriveLabel = (controlElement: ControlElement): string => {

  if (controlElement.scope !== undefined) {
    const ref = controlElement.scope.$ref;
    const label = ref.substr(ref.lastIndexOf('/') + 1);

    return _.startCase(label);
  }

  return '';
};

const getLabelObject = (withLabel: ControlElement): ILabelObject => {
    const labelProperty = withLabel.label;
    const derivedLabel = deriveLabel(withLabel);
    if (typeof labelProperty === 'boolean') {
        if (labelProperty) {
            return new LabelObject(derivedLabel, labelProperty);
        } else {
            return new LabelObject(derivedLabel, labelProperty as boolean);
        }
    } else if (typeof labelProperty === 'string') {
        return new LabelObject(labelProperty as string, true);
    } else if (typeof labelProperty === 'object') {
        const show = labelProperty.hasOwnProperty('show') ? labelProperty.show : true;
        const label = labelProperty.hasOwnProperty('text') ?
          labelProperty.text : derivedLabel;

        return new LabelObject(label, show);
    } else {
        return new LabelObject(derivedLabel, true);
    }
};

/**
 * Return a label object based on the given JSON schema and control element.
 * @param {JsonSchema} schema the JSON schema that the given control element is referring to
 * @param {ControlElement} controlElement the UI schema to obtain a label object for
 * @returns {ILabelObject}
 */
export const getElementLabelObject =
  (schema: JsonSchema, controlElement: ControlElement): ILabelObject => {

  return getLabelObject(controlElement);
};

import {ControlElement, ILabelObject} from '../models/uischema';
class LabelObject implements ILabelObject {
    public text: string;
    public show: boolean;

    constructor(text: string, show: boolean) {
        this.text = text;
        this.show = show;
    }
}
const deriveLabel = (controlElement: ControlElement): string => {
  const ref = controlElement.scope.$ref;
  const label = ref.substr(ref.lastIndexOf('/') + 1);
  return label.charAt(0).toUpperCase() + label.substr(1);
};

export const getElementLabelObject = (withLabel: ControlElement): ILabelObject => {
    const labelProperty = withLabel.label;
    if (typeof labelProperty === 'boolean') {
        if (labelProperty) {
            return new LabelObject(
                deriveLabel(withLabel), labelProperty);
        } else {
            return new LabelObject(undefined, <boolean>labelProperty);
        }
    } else if (typeof labelProperty === 'string') {
        return new LabelObject(<string>labelProperty, true);
    } else if (typeof labelProperty === 'object') {
        const show = labelProperty.hasOwnProperty('show') ? labelProperty.show : true;
        const label = labelProperty.hasOwnProperty('text') ?
          labelProperty.text : deriveLabel(withLabel);
        return new LabelObject(label, show);
    } else {
        return new LabelObject(deriveLabel(withLabel), true);
    }
};

import {ControlElement, ILabelObject} from '../models/uischema';
import { JsonSchema } from '../models/jsonSchema';
import {FullDataModelType, isItemModel} from '../parser/item_model';
export {FullDataModelType} from '../parser/item_model';
import {resolveSchema} from '../path.util';

class LabelObject implements ILabelObject {
    public text: string;
    public show: boolean;

    constructor(text: string, show: boolean) {
        this.text = text;
        this.show = show;
    }
}
// poor man's version of a startCase implementation
// FIXME why export and if so why here?
export const startCase = (label: string): string =>
    ((label && label.split(/(?=[A-Z])/)) || [])
        .map(token => token.charAt(0).toUpperCase() + token.slice(1))
        .join(' ');

const deriveLabel = (controlElement: ControlElement): string => {
  const ref = controlElement.scope.$ref;
  const label = ref.substr(ref.lastIndexOf('/') + 1);
  return startCase(label);
};

const getLabelObject = (withLabel: ControlElement): ILabelObject => {
    const labelProperty = withLabel.label;
    const derivedLabel = deriveLabel(withLabel);
    if (typeof labelProperty === 'boolean') {
        if (labelProperty) {
            return new LabelObject(derivedLabel, labelProperty);
        } else {
            return new LabelObject(derivedLabel, <boolean>labelProperty);
        }
    } else if (typeof labelProperty === 'string') {
        return new LabelObject(<string>labelProperty, true);
    } else if (typeof labelProperty === 'object') {
        const show = labelProperty.hasOwnProperty('show') ? labelProperty.show : true;
        const label = labelProperty.hasOwnProperty('text') ?
          labelProperty.text : derivedLabel;
        return new LabelObject(label, show);
    } else {
        return new LabelObject(derivedLabel, true);
    }
};
const isRequired = (model: FullDataModelType, schemaPath: string): boolean => {
    const pathSegments = schemaPath.split('/');
    const lastSegment = pathSegments[pathSegments.length - 1];
    const nextHigherSchemaSegments = pathSegments.slice(0, pathSegments.length - 2);
    const nextHigherSchemaPath = nextHigherSchemaSegments.join('/');
    const nextHigherSchema = resolveSchema(model, nextHigherSchemaPath);
    if (isItemModel(nextHigherSchema) && nextHigherSchema.schema.required !== undefined &&
      nextHigherSchema.schema.required.indexOf(lastSegment) !== -1) {
        return true;
    }
    return false;
};
export const getElementLabelObject =
  (model: FullDataModelType, controlElement: ControlElement): ILabelObject => {
  const labelObject = getLabelObject(controlElement);
  if (isRequired(model, controlElement.scope.$ref)) {
    labelObject.text += '*';
  }
  return labelObject;
};

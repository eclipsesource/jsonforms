import {ControlElement, ILabelObject} from '../models/uischema';
import { JsonSchema } from '../models/jsonSchema';
import {resolveSchema} from '../path.util';

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

const getLabelObject = (withLabel: ControlElement): ILabelObject => {
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
const isRequired = (schema: JsonSchema, schemaPath: string): boolean => {
    const pathSegments = schemaPath.split('/');
    const lastSegment = pathSegments[pathSegments.length - 1];
    const nextHigherSchemaSegments = pathSegments.slice(0, pathSegments.length - 2);
    const nextHigherSchemaPath = nextHigherSchemaSegments.join('/');
    const nextHigherSchema = resolveSchema(schema, nextHigherSchemaPath);
    if (nextHigherSchema !== undefined && nextHigherSchema.required !== undefined &&
      nextHigherSchema.required.indexOf(lastSegment) !== -1) {
        return true;
    }
    return false;
};
export const getElementLabelObject =
  (schema: JsonSchema, controlElement: ControlElement): ILabelObject => {
  const labelObject = getLabelObject(controlElement);
  if (isRequired(schema, controlElement.scope.$ref)) {
    labelObject.text += '*';
  }
  return labelObject;
};

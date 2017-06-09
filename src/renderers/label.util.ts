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
/**
 * Poor man's version of a startCase implementation
 * @param {string} the label string that is to be capitalized
 */
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

/**
 * Return a label object based on the given JSON schema and control element.
 * @param {JsonSchema} schema the JSON schema that the given control element is referring to
 * @param {ControlElement} controlElement the UI schema to obtain a label object for
 * @returns {ILabelObject}
 */
export const getElementLabelObject =
  (schema: JsonSchema, controlElement: ControlElement): ILabelObject => {
  const labelObject = getLabelObject(controlElement);
  if (isRequired(schema, controlElement.scope.$ref)) {
    labelObject.text += '*';
  }
  return labelObject;
};

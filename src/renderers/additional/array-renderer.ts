import { UISchemaElement, ControlElement } from '../../models/uischema';
import { JsonForms } from '../../json-forms';
import { Renderer } from '../../core/renderer';
import {DataService, DataChangeListener} from '../../core/data.service';
import { JsonFormsRenderer } from '../renderer.util';
import { resolveSchema } from '../../path.util';
import { generateDefaultUISchema } from '../../generators/ui-schema-gen';
import { JsonSchema } from '../../models/jsonSchema';
import {getElementLabelObject} from '../label.util';

export const ArrayControlTester = (uischema: UISchemaElement, schema: JsonSchema) => {
  if (uischema.type !== 'Control') {
    return -1;
  }
  const subSchema = resolveSchema(schema, (<ControlElement>uischema).scope.$ref);
  if (subSchema === undefined) {
    return -1;
  }
  if (subSchema.type !== 'array') {
    return -1;
  }
  if (subSchema.items === undefined) {
    return -1;
  }
  if (Array.isArray(subSchema.items)) {
    return -1;
  }
  return subSchema.items.type === 'object' ? 2 : -1;
};
@JsonFormsRenderer({
  selector: 'jsonforms-array',
  tester: ArrayControlTester
})
export class ArrayControlRenderer extends Renderer implements DataChangeListener {

  constructor() {
    super();
  }

  isRelevantKey (uischema: ControlElement): boolean {
    return uischema === undefined || uischema === null
    ? false : (<ControlElement>this.uischema).scope.$ref === uischema.scope.$ref;
  }

  notifyChange(uischema: ControlElement, newValue: any, data: any): void {
    this.render();
  }
  connectedCallback(): void {
    super.connectedCallback();
    this.dataService.registerChangeListener(this);
  }
  disconnectedCallback(): void {
    this.dataService.unregisterChangeListener(this);
    super.disconnectedCallback();
  }
  dispose(): void {
    // do nothing
  }

  render(): HTMLElement {
    this.classList.add('control');
    if (this.lastChild !== null) {
      this.removeChild(this.lastChild);
    }
    const controlElement = <ControlElement> this.uischema;
    const div = document.createElement('fieldset');
    div.className = 'array-layout';

    const header = document.createElement('legend');
    div.appendChild(header);
    const label = document.createElement('label');
    const labelObject = getElementLabelObject(this.dataSchema, controlElement);
    if (labelObject.show) {
      label.textContent = labelObject.text;
    }
    header.appendChild(label);

    const content = document.createElement('div');
    content.classList.add('children');
    let arrayData = this.dataService.getValue(controlElement);

    const renderChild = (element: Object): void => {
      const jsonForms = <JsonForms>document.createElement('json-forms');
      const resolvedSchema = resolveSchema(this.dataSchema, controlElement.scope.$ref + '/items');
      jsonForms.data = element;
      jsonForms.dataSchema = resolvedSchema;
      content.appendChild(jsonForms);
    };

    if (arrayData !== undefined) {
      arrayData.forEach(element => renderChild(element));
    }
    div.appendChild(content);

    const button = document.createElement('button');
    button.textContent = `Add to ${labelObject.text}`;
    button.onclick = (ev: Event) => {
      if (arrayData === undefined) {
        arrayData = [];
      }
      const element = {};
      arrayData.push(element);
      renderChild(element);
      this.dataService.notifyChange(controlElement, arrayData);
    };

    header.appendChild(button);
    this.appendChild(div);
    return this;
  }
}

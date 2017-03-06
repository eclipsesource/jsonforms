import { UISchemaElement, ControlElement } from '../../models/uischema';
import { JsonForms } from '../../json-forms';
import { Renderer, DataChangeListener, DataService } from '../../core';
import { JsonFormsRenderer } from '../renderer.util';
import { resolveSchema } from "../../path.util";
import { generateDefaultUISchema } from "../../generators/ui-schema-gen";

@JsonFormsRenderer({
  selector: 'jsonforms-array',
  tester: (uischema: UISchemaElement) => uischema.type === 'ArrayControl' ? 1 : -1
})
export class ArrayControlRenderer extends Renderer implements DataChangeListener {

  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
    this.dataService.registerChangeListener(this);
  }

  isRelevantKey = (uischema: ControlElement): boolean => this.uischema === uischema;

  notifyChange(uischema: ControlElement, newValue: any, data: any): void {
    this.render();
  }

  dispose(): void {
    this.dataService.unregisterChangeListener(this);
  }
  render(): HTMLElement {
    if (this.lastChild !== null) {
      this.removeChild(this.lastChild);
    }
    const controlElement = <ControlElement> this.uischema;
    const div = document.createElement('div');
    div.className = 'array-layout';

    const label = document.createElement('label');
    if (typeof controlElement.label === 'string') {
      label.textContent = controlElement.label;
    }
    div.appendChild(label);

    const content = document.createElement('div');
    let arrayData = this.dataService.getValue(controlElement);

    const renderChild= (element) => {
      const jsonForms = <JsonForms>document.createElement('json-forms');
      const resolvedSchema = resolveSchema(this.dataSchema, controlElement.scope.$ref + "/items");
      const uiSchema = generateDefaultUISchema(resolvedSchema);
      jsonForms.dataObject = element;
      jsonForms.dataService = new DataService(element);
      jsonForms.uischema = uiSchema;
      jsonForms.dataschema = resolvedSchema;
      content.appendChild(jsonForms);
      return uiSchema;
    };

    if (arrayData !== undefined) {
      const uiElements = [];
      arrayData.forEach(element => uiElements.push(renderChild(element)));
      controlElement['elements'] = uiElements;
    }
    div.appendChild(content);

    const button = document.createElement('button');
    button.textContent = 'Add me';
    button.onclick = (ev: Event) => {
      if (arrayData === undefined) {
        arrayData = [];
      }
      const element = {};
      arrayData.push(element);
      const renderedChild = renderChild(element);
      if (controlElement['elements'] == undefined) {
        controlElement['elements'] = [];
      }
      controlElement['elements'].push(renderedChild);
      this.dataService.notifyChange(controlElement, arrayData);
    };

    div.appendChild(button);
    this.appendChild(div);
    return this;
  }
}

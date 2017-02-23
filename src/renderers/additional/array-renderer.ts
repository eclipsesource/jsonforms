import { UISchemaElement, ControlElement, VerticalLayout } from '../../models/uischema';
import { JsonForms } from '../../json-forms';
import { Renderer, DataChangeListener, DataService, JsonFormsHolder } from '../../core';
import { JsonFormsRenderer } from '../renderer.util';
import { resolveSchema } from "../../path.util";
import { generateDefaultUISchema } from "../../generators/ui-schema-gen";

@JsonFormsRenderer({
  selector: 'jsonforms-array2',
  tester: (uischema: UISchemaElement) => uischema.type === 'ArrayControl2' ? 1 : -1
})
class ArrayControlRenderer2 extends Renderer implements DataChangeListener {

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
    // Do nothing
  }
  render(): HTMLElement {
    this.dataService.registerChangeListener(this);
    if (this.lastChild !== null) {
      this.removeChild(this.lastChild);
    }
    const controlElement = <ControlElement> this.uischema;
    const div = document.createElement('div');
    div.className = 'array-layout';

    const label = document.createElement('label');
    label.textContent = controlElement.label;
    div.appendChild(label);

    const content = document.createElement('div');
    let arrayData = this.dataService.getValue(controlElement);

    if (arrayData !== undefined) {
      arrayData.forEach(element => {
        const jsonForms = <JsonForms>document.createElement('json-forms');
        jsonForms.data = element;
        jsonForms.uiSchema = <VerticalLayout>{
          'type': 'VerticalLayout',
          'elements': [
            <ControlElement>{
              'type': 'Control',
              'label': 'Name',
              'scope': {
                '$ref': '#/properties/name'
              }
            }
          ]
        };
        jsonForms.dataSchema = {
          'type': 'object',
          'properties': {
            'name': {
              'type' : 'string', 'minLength': 5
            }
          }
        };
        content.appendChild(jsonForms);
      });
    }
    div.appendChild(content);

    const button = document.createElement('button');
    button.textContent = 'Add me';
    button.onclick = (ev: Event) => {
      if (arrayData === undefined) {
        arrayData = [];
      }
      arrayData.push({});
      this.dataService.notifyChange(controlElement, arrayData);
    };

    div.appendChild(button);
    this.appendChild(div);
    return this;
  }
}


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
    // Do nothing
  }
  render(): HTMLElement {
    this.dataService.registerChangeListener(this);
    if (this.lastChild !== null) {
      this.removeChild(this.lastChild);
    }
    const controlElement = <ControlElement> this.uischema;
    const div = document.createElement('div');
    div.className = 'array-layout';

    const label = document.createElement('label');
    label.textContent = controlElement.label;
    div.appendChild(label);

    const content = document.createElement('div');
    let arrayData = this.dataService.getValue(controlElement);
    const renderChild = (element) => {
      const resolvedSchema = resolveSchema(this.dataSchema, controlElement.scope.$ref + "/items");
      const innerDataSchema = resolvedSchema;
      const innerUiSchema = generateDefaultUISchema(resolvedSchema);
      let lastRenderer = JsonFormsHolder.rendererService
          .getBestRenderer(innerUiSchema, innerDataSchema, new DataService(element));
      content.appendChild(lastRenderer);

      return innerUiSchema;
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
import { UISchemaElement, ControlElement, VerticalLayout } from '../../models/uischema';
import { JsonForms } from '../../json-forms';
import { Renderer, DataChangeListener, DataService, JsonFormsHolder } from '../../core';
import { JsonFormsRenderer } from '../renderer.util';

@JsonFormsRenderer({
  selector: 'jsonforms-array',
  tester: (uischema: UISchemaElement) => uischema.type === 'ArrayControl' ? 1 : -1
})
class ArrayControlRenderer extends Renderer implements DataChangeListener {

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

  private render() {
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
  }
}

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

  private render() {
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
        let innerUiSchema = <VerticalLayout>{
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
        let innerDataSchema = {
          'type': 'object',
          'properties': {
            'name': {
              'type' : 'string',
              'minLength': 5
            }
          }
        };
        // TODO create sub DataService from existing
        let lastRenderer = JsonFormsHolder.rendererService
            .getBestRenderer(innerUiSchema, innerDataSchema, new DataService(element));
        content.appendChild(lastRenderer);
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
  }
}

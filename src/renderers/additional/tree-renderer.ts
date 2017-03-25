import {UISchemaElement, ControlElement, VerticalLayout} from '../../models/uischema';
import { Renderer, DataChangeListener, DataService, JsonFormsHolder } from '../../core';
import {JsonFormsRenderer} from '../renderer.util';

@JsonFormsRenderer({
  selector: 'jsonforms-tree',
  tester: (uischema: UISchemaElement) => uischema.type === 'MasterDetailLayout' ? 1 : -1
})
class TreeRenderer extends Renderer implements DataChangeListener {
  private master: HTMLElement;
  private detail: HTMLElement;

  constructor() {
    super();
  }

  dispose(): void {
    // Do nothing
  }
  render(): HTMLElement {
    const controlElement = <ControlElement> this.uischema;

    let div = document.createElement('div');
    div.className = 'tree-layout';

    const label = document.createElement('label');
    if (typeof controlElement.label === 'string') {
      label.textContent = controlElement.label;
    }
    this.appendChild(label);
    const button = document.createElement('button');
    button.textContent = 'Add me';

    let arrayData = this.dataService.getValue(controlElement);
    button.onclick = (ev: Event) => {
      if (arrayData === undefined) {
        arrayData = [];
      }
      arrayData.push({});
      this.dataService.notifyChange(controlElement, arrayData);
    };
    this.appendChild(button);

    this.master = document.createElement('div');
    this.master.className = 'tree-master';
    div.appendChild(this.master);

    this.detail = document.createElement('div');
    this.detail.className = 'tree-detail';
    div.appendChild(this.detail);

    this.appendChild(div);
    this.renderFull();
    this.dataService.registerChangeListener(this);
    return this;
  }

  isRelevantKey = (uischema: ControlElement) => this.uischema === uischema;

  notifyChange(uischema: ControlElement, newValue: any, data: any): void {
    this.render();
  }

  private renderFull() {
    this.renderMaster();
    const controlElement = <ControlElement> this.uischema;
    const arrayData = this.dataService.getValue(controlElement);
    if (arrayData !== undefined && arrayData.length !== 0) {
      let firstChild = arrayData;
      if (Array.isArray(firstChild)) {
        firstChild = firstChild[0];
      }
      this.renderDetail(firstChild, <HTMLSpanElement>this.master.lastChild.firstChild.firstChild);
    }
  }

  private renderMaster(): void {
    if (this.master.lastChild !== null) {
      this.master.removeChild(this.master.lastChild);
    }
    const controlElement = <ControlElement> this.uischema;
    const rootData = this.dataService.getValue(controlElement);
    if (rootData !== undefined) {
      const ul = document.createElement('ul');
      if (Array.isArray(rootData)) {
        this.expandArray(rootData, ul);
      } else {
        this.expandObject(rootData, ul);
      }

      this.master.appendChild(ul);
    }
  }
  private expandArray(data: Array<Object>, parent: HTMLUListElement): void {
    data.forEach(element => {
      this.expandObject(element, parent);
    });
  }
  private expandObject(data: Object, parent: HTMLUListElement): void {
    const li = document.createElement('li');
    const span = document.createElement('span');
    span.style.display = 'block';
    span.style.cursor = 'pointer';
    span.onclick = (ev: Event) => this.renderDetail(data, li);
    span.textContent = data[Object.keys(data)[0]];
    li.appendChild(span);

    Object.keys(data).forEach(key => {
      if (Array.isArray(data[key])) {
        const ul = document.createElement('ul');
        this.expandArray(data[key], ul);
        li.appendChild(ul);
      }
    });
    parent.appendChild(li);
  }
  private renderDetail(element: Object, label: HTMLSpanElement): void {
    if (this.detail.lastChild !== null) {
      this.detail.removeChild(this.detail.lastChild);
    }
    const innerUiSchema = <VerticalLayout>{
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
    const innerDataSchema = {
      'type': 'object',
      'properties': {
        'name': {
          'type' : 'string',
          'minLength': 5
        }
      }
    };
    const innerDataService = new DataService(element);
    innerDataService.registerChangeListener({
      isRelevantKey(uischema: ControlElement): boolean {
        return true;
      },
      notifyChange(uischema: ControlElement, newValue: any, data: any): void {
        const text = element[Object.keys(element)[0]];
        if (text === undefined) {
          label.textContent = '';
        } else {
          label.textContent = text;
        }
      }
    });
    const lastRenderer = JsonFormsHolder.rendererService
        .getBestRenderer(innerUiSchema, innerDataSchema, innerDataService);
    this.detail.appendChild(lastRenderer);
  }
}

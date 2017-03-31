import {UISchemaElement, ControlElement, VerticalLayout} from '../../models/uischema';
import {JsonFormsHolder} from '../../core';
import {Renderer} from '../../core/renderer';
import {DataService, DataChangeListener} from '../../core/data.service';
import {JsonFormsRenderer} from '../renderer.util';
import {resolveSchema} from '../../path.util';
import {JsonForms} from '../../json-forms';
import {JsonSchema} from '../../models/jsonSchema';

@JsonFormsRenderer({
  selector: 'jsonforms-tree',
  tester: (uischema: UISchemaElement) => uischema.type === 'MasterDetailLayout' ? 1 : -1
})
class TreeRenderer extends Renderer implements DataChangeListener {
  private master: HTMLElement;
  private detail: HTMLElement;
  private selected: HTMLLIElement;
  private dialog;
  private addingToRoot = false;
  private resolvedSchema: JsonSchema;

  constructor() {
    super();
  }

  dispose(): void {
    // Do nothing
  }
  render(): HTMLElement {
    const controlElement = <ControlElement> this.uischema;
    this.resolvedSchema = resolveSchema(this.dataSchema, controlElement.scope.$ref);

    let div = document.createElement('div');
    div.className = 'tree-layout';

    const label = document.createElement('label');
    if (typeof controlElement.label === 'string') {
      label.textContent = controlElement.label;
    }
    this.appendChild(label);

    let rootData = this.dataService.getValue(controlElement);
    if (Array.isArray(rootData)) {
      const button = document.createElement('button');
      button.textContent = 'Add to root';

      button.onclick = (ev: Event) => {
        const newData = {};
        this.addingToRoot = true;
        const length = rootData.push(newData);
        this.dataService.notifyChange(controlElement, rootData);
        this.expandObject(newData, <HTMLUListElement>this.master.firstChild, this.dataSchema.items,
          toDelete => rootData.splice(length - 1, 1));
        this.addingToRoot = false;
      };
      this.appendChild(button);
    }

    this.master = document.createElement('div');
    this.master.className = 'tree-master';
    div.appendChild(this.master);

    this.detail = document.createElement('div');
    this.detail.className = 'tree-detail';
    div.appendChild(this.detail);

    this.appendChild(div);
    this.dialog = document.createElement('dialog');
    const dialogContent = document.createElement('div');
    dialogContent.classList.add('content');
    this.dialog.appendChild(dialogContent);
    const dialogClose = document.createElement('button');
    dialogClose.innerText = 'Close';
    dialogClose.onclick = () => this.dialog.close();
    this.dialog.appendChild(dialogClose);
    this.appendChild(this.dialog);
    this.renderFull();
    this.dataService.registerChangeListener(this);
    return this;
  }
  isRelevantKey (uischema: ControlElement): boolean {
    return this.uischema === uischema && !this.addingToRoot;
  }

  notifyChange(uischema: ControlElement, newValue: any, data: any): void {
    this.render();
  }

  private renderFull(): void {
    this.renderMaster(this.resolvedSchema);
    this.selectFirstElement();
  }

  private selectFirstElement(): void {
    const controlElement = <ControlElement> this.uischema;
    const arrayData = this.dataService.getValue(controlElement);
    if (arrayData !== undefined && arrayData.length !== 0) {
      let firstChild = arrayData;
      let schema = this.resolvedSchema;
      if (Array.isArray(firstChild)) {
        firstChild = firstChild[0];
        schema = schema.items;
      }
      this.renderDetail(firstChild, <HTMLLIElement>this.master.firstChild.firstChild, schema);
    }
  }

  private renderMaster(schema: JsonSchema): void {
    if (this.master.lastChild !== null) {
      this.master.removeChild(this.master.lastChild);
    }
    const controlElement = <ControlElement> this.uischema;
    const rootData = this.dataService.getValue(controlElement);
    if (rootData !== undefined) {
      const ul = document.createElement('ul');
      if (Array.isArray(rootData)) {
        this.expandArray(rootData, ul, <JsonSchema>schema.items);
      } else {
        this.expandObject(rootData, ul, schema, null);
      }

      this.master.appendChild(ul);
    }
  }
  private expandArray(data: Array<Object>, parent: HTMLUListElement, schema: JsonSchema): void {
    data.forEach((element, index) => {
      this.expandObject(element, parent, schema, toDelete => data.splice(index, 1));
    });
  }
  private getArrayProperties(schema: JsonSchema): Array<string> {
    return Object.keys(schema.properties).filter(key => schema.properties[key].items !== undefined);
  }
  private getNamingFunction(schema: JsonSchema): (element: Object) => string {
    return (element) => element[this.uischema.options['labelProvider'][schema.id]];
  }
  private addElement(key: string, data: Object, schema: JsonSchema, li: HTMLLIElement): void {
    if (data[key] === undefined) {
      data[key] = [];
    }
    const childArray = data[key];
    const newData = {};
    const length = childArray.push(newData);
    let subChildren = li.getElementsByTagName('ul');
    let childParent;
    if (subChildren.length !== 0) {
      childParent = subChildren.item(0);
    } else {
      childParent = document.createElement('ul');
      li.appendChild(childParent);
    }
    this.expandObject(newData, childParent, schema.properties[key].items,
      toDelete => childArray.splice(length - 1, 1));
  };
  private expandObject(data: Object, parent: HTMLUListElement, schema: JsonSchema,
      deleteFunction: (element: Object) => void): void {
    const li = document.createElement('li');
    const div = document.createElement('div');
    const spanIcon = document.createElement('span');
    spanIcon.classList.add('icon');
    spanIcon.classList.add(this.uischema.options['imageProvider'][schema.id]);
    div.appendChild(spanIcon);
    const span = document.createElement('span');
    span.classList.add('label');
    span.onclick = (ev: Event) => this.renderDetail(data, li, schema);
    const spanText = document.createElement('span');
    spanText.textContent = this.getNamingFunction(schema)(data);
    span.appendChild(spanText);
    div.appendChild(span);
    if (this.getArrayProperties(schema).length !== 0) {
      const spanAdd = document.createElement('span');
      spanAdd.classList.add('add');
      spanAdd.onclick = (ev: Event) => {
        ev.stopPropagation();
        const content = this.dialog.getElementsByClassName('content')[0];
        while (content.firstChild) {
          (<Element>content.firstChild).remove();
        }
        this.getArrayProperties(schema).forEach(key => {
          const button = document.createElement('button');
          button.innerText = key;
          button.onclick = () => {
            this.addElement(key, data, schema, li);
            this.dialog.close();
          };
          content.appendChild(button);
        });
        this.dialog.showModal();
      };
      spanAdd.textContent = '\u2795';
      span.appendChild(spanAdd);
    }
    if (deleteFunction !== null) {
      const spanRemove = document.createElement('span');
      spanRemove.classList.add('remove');
      spanRemove.onclick = (ev: Event) => {
        ev.stopPropagation();
        deleteFunction(data);
        li.remove();
        if (this.selected === li) {
          this.selectFirstElement();
        }
      };
      spanRemove.textContent = '\u274C';
      span.appendChild(spanRemove);
    }
    li.appendChild(div);

    Object.keys(data).forEach(key => {
      if (Array.isArray(data[key])) {
        this.renderChildren(data[key], schema.properties[key].items, li, key);
      }
    });

    parent.appendChild(li);
  }
  private renderChildren
    (array: Array<Object>, schema: JsonSchema, li: HTMLLIElement, key: string): void {
    let ul: HTMLUListElement;
    const children = li.children;
    for (let i = 0; i < children.length; i++) {
      const child = children.item(i);
      if (child.tagName === 'UL' && child.getAttribute('children') === key) {
        ul = <HTMLUListElement>child;
      }
    }
    if (ul === undefined) {
      ul = document.createElement('ul');
      ul.setAttribute('children', key);
      li.appendChild(ul);
    } else {
      while (ul.firstChild) {
        (<Element>ul.firstChild).remove();
      }
    }
    this.expandArray(array, ul, schema);
  }
  private renderDetail(element: Object, label: HTMLLIElement, schema: JsonSchema): void {
    if (this.detail.lastChild !== null) {
      this.detail.removeChild(this.detail.lastChild);
    }
    if (this.selected !== undefined) {
      this.selected.classList.toggle('selected');
    }
    label.classList.toggle('selected');
    this.selected = label;

    const jsonForms = <JsonForms>document.createElement('json-forms');
    jsonForms.data = element;
    jsonForms.dataSchema = schema;
    jsonForms.addDataChangeListener({
      isRelevantKey: (uischema: ControlElement): boolean => {
        return uischema !== null;
      },
      notifyChange: (uischema: ControlElement, newValue: any, data: any): void => {
        const segments = uischema.scope.$ref.split('/');
        const lastSegemnet = segments[segments.length - 1];
        if (lastSegemnet === this.uischema.options['labelProvider'][schema.id]) {
          label.firstChild.lastChild.firstChild.textContent = newValue;
        }
        if (Array.isArray(newValue)) {
          this.renderChildren(newValue, resolveSchema(schema, uischema.scope.$ref).items, label,
          lastSegemnet);
        }
      }
    });
    this.detail.appendChild(jsonForms);
  }
}

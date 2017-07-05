import * as _ from 'lodash';
import {ControlElement} from '../../models/uischema';
import {Renderer} from '../../core/renderer';
import {DataChangeListener} from '../../core/data.service';
import {JsonFormsRenderer} from '../renderer.util';
import {resolveSchema} from '../../path.util';
import {JsonFormsElement} from '../../json-forms';
import {JsonSchema} from '../../models/jsonSchema';
import {and, RankedTester, rankWith, uiTypeIs} from '../../core/testers';
import {Runtime, RUNTIME_TYPE} from '../../core/runtime';
import {JsonForms} from '../../core';

/**
 * Default tester for a master-detail layout.
 * @type {RankedTester}
 */
export const treeMasterDetailTester: RankedTester =
    rankWith(
        1,
        and(
            uiTypeIs('MasterDetailLayout'),
            uiSchema => {
              const control = uiSchema as ControlElement;
              if (control.scope === undefined || control.scope === null) {
                return false;
              }

              return !(control.scope.$ref === undefined || control.scope.$ref === null);
            }
        ));

/**
 * Default renderer for a tree-based master-detail layout.
 */
@JsonFormsRenderer({
  selector: 'jsonforms-tree',
  tester: rankWith(1, uiTypeIs('MasterDetailLayout'))
})
export class TreeMasterDetailRenderer extends Renderer implements DataChangeListener {
  private master: HTMLElement;
  private detail: HTMLElement;
  private selected: HTMLLIElement;
  private dialog;
  private addingToRoot = false;
  private resolvedSchema: JsonSchema;

  constructor() {
    super();
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.dataService.registerDataChangeListener(this);
  }

  disconnectedCallback(): void {
    this.dataService.deregisterDataChangeListener(this);
    super.disconnectedCallback();
  }

  dispose(): void {
    // Do nothing
  }

  runtimeUpdated(type: RUNTIME_TYPE): void {
    const runtime = this.uischema.runtime as Runtime;
    switch (type) {
      case RUNTIME_TYPE.VISIBLE:
        this.hidden = !runtime.visible;
        break;
      case RUNTIME_TYPE.ENABLED:
        if (!runtime.enabled) {
          this.setAttribute('disabled', 'true');
        } else {
          this.removeAttribute('disabled');
        }
        break;
      default:
    }
  }

  render(): HTMLElement {
    const controlElement = this.uischema as ControlElement;
    this.resolvedSchema = resolveSchema(this.dataSchema, controlElement.scope.$ref);

    this.className = 'jsf-treeMasterDetail';

    const divHeader = document.createElement('div');
    divHeader.className = 'jsf-treeMasterDetail-header';
    const label = document.createElement('label');
    if (typeof controlElement.label === 'string') {
      label.textContent = controlElement.label;
    }
    divHeader.appendChild(label);

    const rootData = this.dataService.getValue(controlElement);
    if (Array.isArray(rootData)) {
      const button = document.createElement('button');
      button.textContent = 'Add to root';

      button.onclick = (ev: Event) => {
        if (!Array.isArray(this.dataSchema.items)) {
          const newData = {};
          this.addingToRoot = true;
          const length = rootData.push(newData);
          this.dataService.notifyAboutDataChange(controlElement, rootData);
          this.expandObject(
            newData,
            this.master.firstChild as HTMLUListElement,
            this.dataSchema.items,
            () => rootData.splice(length - 1, 1)
          );
          this.addingToRoot = false;
        }
      };
      divHeader.appendChild(button);
    }
    this.appendChild(divHeader);

    const div = document.createElement('div');
    div.className = 'jsf-treeMasterDetail-content';
    this.master = document.createElement('div');
    this.master.className = 'jsf-treeMasterDetail-master';
    div.appendChild(this.master);

    this.detail = document.createElement('div');
    this.detail.className = 'jsf-treeMasterDetail-detail';
    div.appendChild(this.detail);

    this.appendChild(div);
    this.dialog = document.createElement('dialog');
    const title = document.createElement('label');
    title.innerText = 'Select the Item to create:';
    this.dialog.appendChild(title);
    const dialogContent = document.createElement('div');
    dialogContent.classList.add('content');
    this.dialog.appendChild(dialogContent);
    const dialogClose = document.createElement('button');
    dialogClose.innerText = 'Close';
    dialogClose.onclick = () => this.dialog.close();
    this.dialog.appendChild(dialogClose);
    this.appendChild(this.dialog);
    this.renderFull();

    return this;
  }

  needsNotificationAbout (uischema: ControlElement): boolean {
    return uischema === undefined || uischema === null ? false :
      (this.uischema as ControlElement).scope.$ref === uischema.scope.$ref && !this.addingToRoot;
  }

  dataChanged(uischema: ControlElement, newValue: any, data: any): void {
    this.renderFull();
  }

  private renderFull(): void {
    this.renderMaster(this.resolvedSchema);
    this.selectFirstElement();
  }

  private selectFirstElement(): void {
    const controlElement = this.uischema as ControlElement;
    const arrayData = this.dataService.getValue(controlElement);
    if (arrayData !== undefined && arrayData !== null && arrayData.length !== 0) {
      let firstChild = arrayData;
      let schema = this.resolvedSchema;
      if (Array.isArray(firstChild) && !Array.isArray(schema.items)) {
        firstChild = firstChild[0];
        schema = schema.items;
      }
      this.renderDetail(firstChild, this.master.firstChild.firstChild as HTMLLIElement, schema);
    }
  }

  private renderMaster(schema: JsonSchema): void {
    if (this.master.lastChild !== null) {
      this.master.removeChild(this.master.lastChild);
    }
    const controlElement = this.uischema as ControlElement;
    const rootData = this.dataService.getValue(controlElement);
    const ul = document.createElement('ul');
    if (schema.items !== undefined) {
      this.expandArray(rootData, ul, schema.items as JsonSchema);
    } else {
      this.expandObject(rootData, ul, schema, null);
    }
    this.master.appendChild(ul);
  }

  private expandArray(data: Object[], parent: HTMLUListElement, schema: JsonSchema): void {
    if (data === undefined || data === null) {
      return;
    }
    data.forEach((element, index) => {
      this.expandObject(element, parent, schema, () => data.splice(index, 1));
    });
  }

  private getNamingFunction(schema: JsonSchema): (element: Object) => string {
    if (this.uischema.options !== undefined) {
      const labelProvider = this.uischema.options.labelProvider;
      if (labelProvider !== undefined) {
        return element => element[labelProvider[schema.id]];
      }
    }
    const namingKeys = Object.keys(schema.properties).filter(key => key === 'id' || key === 'name');
    if (namingKeys.length !== 0) {
      return element => element[namingKeys[0]];
    }

    return obj => JSON.stringify(obj);
  }

  private updateTreeOnAdd(
    schema: JsonSchema,
    li: HTMLLIElement,
    newData: object,
    deleteFunction: (toDelete: object) => void
  ): void {
    const subChildren = li.getElementsByTagName('ul');
    let childParent;
    if (subChildren.length !== 0) {
      childParent = subChildren.item(0);
    } else {
      childParent = document.createElement('ul');
      li.appendChild(childParent);
    }
    this.expandObject(newData, childParent, schema,  deleteFunction);
  }

  private expandObject(
    data: Object,
    parent: HTMLUListElement,
    schema: JsonSchema,
    deleteFunction: (toDelete: object) => void
  ): void {
    const li = document.createElement('li');
    const div = document.createElement('div');
    if (this.uischema.options !== undefined &&
      this.uischema.options.imageProvider !== undefined) {
      const spanIcon = document.createElement('span');
      spanIcon.classList.add('icon');
      spanIcon.classList.add(this.uischema.options.imageProvider[schema.id]);
      div.appendChild(spanIcon);
    }
    const span = document.createElement('span');
    span.classList.add('label');
    span.onclick = (ev: Event) => {
      this.renderDetail(data, li, schema);
    };
    const spanText = document.createElement('span');
    spanText.textContent = this.getNamingFunction(schema)(data);
    span.appendChild(spanText);
    div.appendChild(span);
    if (JsonForms.schemaService.hasContainmentProperties(schema)) {
      const spanAdd = document.createElement('span');
      spanAdd.classList.add('add');
      spanAdd.onclick = (ev: Event) => {
        ev.stopPropagation();
        const content = this.dialog.getElementsByClassName('content')[0];
        while (content.firstChild) {
          (content.firstChild as Element).remove();
        }
        JsonForms.schemaService.getContainmentProperties(schema).forEach(property => {
          const button = document.createElement('button');
          button.innerText = property.label;
          button.onclick = () => {
            const newData = {};
            property.addToData(data)(newData);
            this.updateTreeOnAdd(property.schema, li, newData, property.deleteFromData(data));
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

    JsonForms.schemaService.getContainmentProperties(schema).forEach(property => {
      const propertyData = property.getData(data);
      if (!_.isEmpty(propertyData)) {
        this.renderChildren(propertyData as Object[], property.schema, li, property.property);
      }
    });

    parent.appendChild(li);
  }

  private findRendererChildContainer(li: HTMLLIElement, key: string): HTMLUListElement {
    let ul: HTMLUListElement;
    const children = li.children;
    for (let i = 0; i < children.length; i++) {
      const child = children.item(i);
      if (child.tagName === 'UL' && child.getAttribute('children') === key) {
        ul = child as HTMLUListElement;
      }
    }

    return ul;
  }

  private renderChildren
    (array: Object[], schema: JsonSchema, li: HTMLLIElement, key: string): void {
    let ul: HTMLUListElement = this.findRendererChildContainer(li, key);
    if (ul === undefined) {
      ul = document.createElement('ul');
      ul.setAttribute('children', key);
      li.appendChild(ul);
    } else {
      while (!_.isEmpty(ul.firstChild)) {
        (ul.firstChild as Element).remove();
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

    const jsonForms = document.createElement('json-forms') as JsonFormsElement;
    jsonForms.data = element;
    jsonForms.dataSchema = schema;
    // check needed for tests
    if (!_.isEmpty(jsonForms.addDataChangeListener)) {
      jsonForms.addDataChangeListener({
        needsNotificationAbout: (uischema: ControlElement): boolean => {
          return uischema !== null;
        },
        dataChanged: (uischema: ControlElement, newValue: any, data: any): void => {
          const segments = uischema.scope.$ref.split('/');
          const lastSegemnet = segments[segments.length - 1];
          if (lastSegemnet === this.uischema.options.labelProvider[schema.id]) {
            label.firstChild.lastChild.firstChild.textContent = newValue;
          }
          if (Array.isArray(newValue)) {
            const childSchema = resolveSchema(schema, uischema.scope.$ref).items;
            if (!Array.isArray(childSchema)) {
              this.renderChildren(newValue, childSchema, label, lastSegemnet);
            }
          }
        }
      });
    }
    this.detail.appendChild(jsonForms);
  }
}

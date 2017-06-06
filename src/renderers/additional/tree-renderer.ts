import {ControlElement} from '../../models/uischema';
import {Renderer} from '../../core/renderer';
import {DataChangeListener} from '../../core/data.service';
import {JsonFormsRenderer} from '../renderer.util';
import {resolveSchema} from '../../path.util';
import {JsonForms} from '../../json-forms';
import {JsonSchema} from '../../models/jsonSchema';
import {uiTypeIs, rankWith, and, RankedTester} from '../../core/testers';
import {Runtime, RUNTIME_TYPE} from '../../core/runtime';
import {isItemModel, FullDataModelType, isMultipleItemModel, isReferenceModel, ITEM_MODEL_TYPES}
  from '../../parser/item_model';
import {extractSchemaFromModel} from '../../parser/util';

export const treeMasterDetailTester: RankedTester = rankWith(1,
  and(
    uiTypeIs('MasterDetailLayout'),
    (uiSchema) => {
      const control = uiSchema as ControlElement;
      if (control.scope === undefined || control.scope === null) {
        return false;
      }
      if (control.scope.$ref === undefined || control.scope.$ref === null) {
        return false;
      }
      return true;
    }
));
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
  private resolvedSchema: FullDataModelType;

  constructor() {
    super();
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
    // Do nothing
  }
  notify(type: RUNTIME_TYPE): void {
    const runtime = <Runtime>this.uischema['runtime'];
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
    }
  }
  render(): HTMLElement {
    const controlElement = <ControlElement> this.uischema;
    this.resolvedSchema = resolveSchema(this.dataModel, controlElement.scope.$ref);

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
        const newData = {};
        this.addingToRoot = true;
        const length = rootData.push(newData);
        this.dataService.notifyChange(controlElement, rootData);
        if (!isItemModel(this.dataModel)) {
          return;
        }
        this.expandObject(newData, <HTMLUListElement>this.master.firstChild,
          controlElement.scope.$ref === '#' ? this.dataModel.dropPoints['array'] :
          this.resolvedSchema, toDelete => rootData.splice(length - 1, 1));
        this.addingToRoot = false;
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
  isRelevantKey (uischema: ControlElement): boolean {
    return uischema === undefined || uischema === null ? false :
      (<ControlElement>this.uischema).scope.$ref === uischema.scope.$ref && !this.addingToRoot;
  }

  notifyChange(uischema: ControlElement, newValue: any, data: any): void {
    this.renderFull();
  }

  private renderFull(): void {
    this.renderMaster(this.resolvedSchema);
    this.selectFirstElement();
  }

  private selectFirstElement(): void {
    const controlElement = <ControlElement> this.uischema;
    const arrayData = this.dataService.getValue(controlElement);
    if (arrayData !== undefined && arrayData !== null) {
      const helper = (innerModel: FullDataModelType) => {
        if (isItemModel(innerModel)) {
          let firstChild = arrayData;
          let schema = innerModel.schema;
          if (Array.isArray(firstChild)) {
            firstChild = firstChild[0];
          }
          this.renderDetail(firstChild, <HTMLLIElement>this.master.firstChild.firstChild, schema);
        } else if (isMultipleItemModel(innerModel)) {
          // TODO selectFirstElement for MultipleItemModel
        } else if (isReferenceModel(innerModel)) {
          helper(innerModel.targetModel);
        }
      };
      if (Array.isArray(arrayData) && isItemModel(this.dataModel)) {
        helper(controlElement.scope.$ref === '#' ? this.dataModel.dropPoints['array'] :
          this.resolvedSchema);
      } else {
        helper(this.resolvedSchema);
      }
    }
  }

  private renderMaster(model: FullDataModelType): void {
    if (this.master.lastChild !== null) {
      this.master.removeChild(this.master.lastChild);
    }
    const controlElement = <ControlElement> this.uischema;
    const rootData = this.dataService.getValue(controlElement);
    const ul = document.createElement('ul');
    const renderModel = (innerModel: FullDataModelType) => {
      if (isItemModel(innerModel)) {
        if (innerModel.schema.items !== undefined || innerModel.type === ITEM_MODEL_TYPES.ARRAY) {
         // the items are available as a droppoint with key 'array'
          this.expandArray(<Array<object>>rootData, ul, controlElement.scope.$ref === '#' ?
          innerModel.dropPoints['array'] : innerModel);
        } else {
          this.expandObject(rootData, ul, innerModel, null);
       }
      } else if (isMultipleItemModel(innerModel)) {
        // TODO handle multiple item model when necessary
      } else if (isReferenceModel(innerModel)) {
          renderModel(innerModel.targetModel);
      }
    };

    renderModel(model);
    this.master.appendChild(ul);
  }
  private expandArray(data: Array<Object>, parent: HTMLUListElement,
    model: FullDataModelType): void {
    if (data === undefined || data === null) {
      return;
    }
    const expandModel = (innerModel: FullDataModelType)  => {
      let schema;
      if (isItemModel(model)) {
        schema = model.schema;
      } else if (isMultipleItemModel(model)) {
        // TODO handle multiple item model
      } else if (isReferenceModel(model)) {
        expandModel(model.targetModel);
      }
      data.forEach((element, index) => {
        this.expandObject(element, parent, innerModel, toDelete => data.splice(index, 1));
      });
    };

    expandModel(model);
  }

  /**
  * Returns the names of all properties of type array.
  */
  private getArrayProperties(model: FullDataModelType): Array<string> {
    if (isItemModel(model)) {
      return Object.keys(model.dropPoints);
    } else if (isMultipleItemModel(model)) {
      // TODO get array properties for MultipleItemModel
      return undefined;
    } else if (isReferenceModel(model)) {
      return this.getArrayProperties(model.targetModel);
    }
  }
  /**
   * Returns a function that produces a name for a data object
   * defined by the given model
  */
  private getNamingFunction(model: FullDataModelType): (element: Object) => string {
    if (isItemModel(model)) {
      if (model.schema.properties !== undefined && model.schema.properties !== null) {
        const namingKeys = Object.keys(model.schema.properties)
          .filter(key => key === 'id' || key === 'name' || key === 'identifier');
        if (namingKeys !== undefined && namingKeys !== null && namingKeys.length !== 0) {
          return (element) => element[namingKeys[0]];
        }
      }
      return (element) => model.label + JSON.stringify(element);
    } else if (isReferenceModel(model)) {
      return this.getNamingFunction(model.targetModel);
    }
    return JSON.stringify;
  }
  /**
   * Adds a new element for the property key to the object data.
   * model is the parsed schema object for data.
  */
  private addElement(key: string, data: Object, model: FullDataModelType, li: HTMLLIElement): void {
    if (data[key] === undefined) {
      data[key] = [];
    }
    const childArray = data[key];
    const newData = {};
    const length = childArray.push(newData);
    const subChildren = li.getElementsByTagName('ul');
    let childParent;
    if (subChildren.length !== 0) {
      childParent = subChildren.item(0);
    } else {
      childParent = document.createElement('ul');
      li.appendChild(childParent);
    }
    const expandHelper = (targetModel) => {
      if (isItemModel(targetModel)) {
        this.expandObject(newData, childParent, targetModel.dropPoints[key],
          toDelete => childArray.splice(length - 1, 1));
      } else if (isMultipleItemModel(targetModel)) {
        // TODO multiple item model
      } else if (isReferenceModel(targetModel)) {
        expandHelper(targetModel.targetModel);
      }
    };
    expandHelper(model);
  };
  /**
   * Renders the given data object as a child of the parent.
  */
  private expandObject(data: Object, parent: HTMLUListElement, model: FullDataModelType,
      deleteFunction: (element: Object) => void): void {
    const li = document.createElement('li');
    const div = document.createElement('div');
    if (this.uischema.options !== undefined &&
      this.uischema.options['imageProvider'] !== undefined) {
      const spanIcon = document.createElement('span');
      spanIcon.classList.add('icon');
      if (isItemModel(model)) {
        spanIcon.classList.add(this.uischema.options['imageProvider'][model.schema.id]);
      }
      div.appendChild(spanIcon);
    }
    const span = document.createElement('span');
    span.classList.add('label');
    let schema: JsonSchema = extractSchemaFromModel(model);
    span.onclick = (ev: Event) => this.renderDetail(data, li, schema);
    const spanText = document.createElement('span');
    spanText.textContent = this.getNamingFunction(model)(data);
    span.appendChild(spanText);
    div.appendChild(span);
    if (this.getArrayProperties(model).length !== 0) {
      const spanAdd = document.createElement('span');
      spanAdd.classList.add('add');
      spanAdd.onclick = (ev: Event) => {
        ev.stopPropagation();
        const content = this.dialog.getElementsByClassName('content')[0];
        while (content.firstChild) {
          (<Element>content.firstChild).remove();
        }
        this.getArrayProperties(model).forEach(key => {
          const button = document.createElement('button');
          button.innerText = key;
          button.onclick = () => {
            this.addElement(key, data, model, li);
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
        const renderHelper = (targetModel) => {
          if (isItemModel(targetModel)) {
            this.renderChildren(data[key], targetModel.dropPoints[key] , li, key);
          } else if (isMultipleItemModel(targetModel)) {
            // TODO multiple item model
          } else if (isReferenceModel(targetModel)) {
            renderHelper(targetModel.targetModel);
          }
        };
        renderHelper(model);
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
        ul = <HTMLUListElement>child;
      }
    }
    return ul;
  }
  private renderChildren
    (array: Array<Object>, model: FullDataModelType, li: HTMLLIElement, key: string): void {
    let ul: HTMLUListElement = this.findRendererChildContainer(li, key);
    if (ul === undefined) {
      ul = document.createElement('ul');
      ul.setAttribute('children', key);
      li.appendChild(ul);
    } else {
      while (ul.firstChild) {
        (<Element>ul.firstChild).remove();
      }
    }
    this.expandArray(array, ul, model);
  }
  /*
    Render an element's details with JsonForms.
  */
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
    // check needed for tests
    if (jsonForms.addDataChangeListener) {
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
            this.renderChildren(newValue, resolveSchema(schema, uischema.scope.$ref)['items'],
            label, lastSegemnet);
          }
        }
      });
    }
    this.detail.appendChild(jsonForms);
  }
}

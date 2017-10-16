/* tslint:disable:max-file-line-count */
import * as _ from 'lodash';
import { MasterDetailLayout, Scopable } from '../../models/uischema';
import { Renderer } from '../../core/renderer';
import { DataChangeListener } from '../../core/data.service';
import { JsonFormsRenderer } from '../renderer.util';
import { resolveSchema } from '../../path.util';
import { JsonFormsElement } from '../../json-forms';
import { JsonSchema } from '../../models/jsonSchema';
import { and, RankedTester, rankWith, uiTypeIs } from '../../core/testers';
import { Runtime, RUNTIME_TYPE } from '../../core/runtime';
import { JsonForms } from '../../core';
import { ContainmentProperty } from '../../core/schema.service';
import {
  registerDragAndDrop,
  TreeNodeInfo
} from './tree-renderer.dnd';

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
              const control = uiSchema as MasterDetailLayout;
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

  /** maps tree nodes (<li>) to their represented data, and schema delete function */
  private treeNodeMapping: Map<HTMLLIElement, TreeNodeInfo> =
      new Map<HTMLLIElement, TreeNodeInfo>();

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
    const controlElement = this.uischema as MasterDetailLayout;
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
    this.dialog.classList.add('jsf-treeMasterDetail-dialog');
    const title = document.createElement('label');
    title.innerText = 'Select the Item to create:';
    title.classList.add('jsf-treeMasterDetail-dialog-title');
    this.dialog.appendChild(title);
    const dialogContent = document.createElement('div');
    dialogContent.classList.add('content');
    dialogContent.classList.add('jsf-treeMasterDetail-dialog-content');
    this.dialog.appendChild(dialogContent);
    const dialogClose = document.createElement('button');
    dialogClose.innerText = 'Close';
    dialogClose.onclick = () => this.dialog.close();
    JsonForms.stylingRegistry.addStyle(dialogClose, 'button');
    dialogClose.classList.add('jsf-treeMasterDetail-dialog-button');
    this.dialog.appendChild(dialogClose);
    this.appendChild(this.dialog);
    this.renderFull();
    this.classList.add(this.convertToClassName(controlElement.scope.$ref));

    return this;
  }

  needsNotificationAbout (uischema: Scopable): boolean {
    return uischema === undefined || uischema === null ? false :
      (this.uischema as MasterDetailLayout).scope.$ref === uischema.scope.$ref
      && !this.addingToRoot;
  }

  dataChanged(uischema: MasterDetailLayout, newValue: any, data: any): void {
    this.renderFull();
  }

  protected renderFull(): void {
    this.renderMaster(this.resolvedSchema);
    this.selectFirstElement();
  }

  protected selectFirstElement(): void {
    const controlElement = this.uischema as MasterDetailLayout;
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

  protected renderDetail(element: Object, label: HTMLLIElement, schema: JsonSchema): void {
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
    // NOTE check needed for tests
    if (jsonForms.addDataChangeListener !== undefined && jsonForms.addDataChangeListener !== null) {
      jsonForms.addDataChangeListener({
        needsNotificationAbout: (uischema: MasterDetailLayout): boolean => {
          return uischema !== null;
        },
        dataChanged: (uischema: MasterDetailLayout, newValue: any, data: any): void => {
          const segments = uischema.scope.$ref.split('/');
          const lastSegment = segments[segments.length - 1];
          if (lastSegment === this.uischema.options.labelProvider[schema.id]) {
            // TODO very ugly setting of label
            label.firstChild.lastChild.firstChild.textContent = newValue;
          }
          if (Array.isArray(newValue)) {
            const childSchema = resolveSchema(schema, uischema.scope.$ref).items;
            if (!Array.isArray(childSchema)) {
              // TODO is the check of childSchema unnecessary?
              this.renderChildren(newValue, label, lastSegment);
            }
          }
        }
      });
    }
    this.detail.appendChild(jsonForms);
  }

  private renderMaster(schema: JsonSchema): void {
    if (this.master.lastChild !== null) {
      this.master.removeChild(this.master.lastChild);
    }
    const controlElement = this.uischema as MasterDetailLayout;
    const rootData = this.dataService.getValue(controlElement);

    // TODO: so far no drag and drop on root level
    const ul = document.createElement('ul');
    if (schema.items !== undefined) {
      this.expandRootArray(rootData, ul, schema.items as JsonSchema);
    } else {
      this.expandObject(rootData, ul, schema, null);
    }
    this.master.appendChild(ul);
  }

  /**
   * Expands the given array of root elements by expanding every element.
   * It is assumed that the roor elements do not support drag and drop.
   * Based on this, a delete function is created for every element.
   *
   * @param data the array to expand
   * @param parent the list that will contain the expanded elements
   * @param schema the {@link JsonSchema} defining the elements' type
   */
  private expandRootArray(data: Object[], parent: HTMLUListElement, schema: JsonSchema): void {
    if (data === undefined || data === null) {
      return;
    }
    data.forEach((element, index) => {
      this.expandObject(element, parent, schema, () => data.splice(index, 1));
    });
  }

  /**
   * Expands the given data array by expanding every element.
   * If the parent data containing the array is provided,
   * a suitable delete function for the expanded elements is created.
   *
   * @param data the array to expand
   * @param parent the list that will contain the expanded elements
   * @param property the {@link ContainmentProperty} defining the property that the array belongs to
   *                 or an array of ContainmentProperties that contains a property for every
   *                 data object of the same index.
   * @param parentData the data containing the array as a property
   */
  private expandArray(data: Object[], parent: HTMLUListElement,
                      property: ContainmentProperty|ContainmentProperty[],
                      parentData?: Object): void {
    if (data === undefined || data === null) {
      return;
    }
    data.forEach((element, index) => {
      let actualProperty: ContainmentProperty;
      if (Array.isArray(property)) {
        actualProperty = property[index];
      } else {
        actualProperty = property;
      }
      if (_.isEmpty(actualProperty)) {
        console.error(`Could not render data object because no containment property was given`,
                      element);

        return;
      }
      let deleteFunction = null;
      if (!_.isEmpty(parentData)) {
        deleteFunction = actualProperty.deleteFromData(parentData);
      }
      this.expandObject(element, parent, actualProperty.schema, deleteFunction);
    });
  }

  private getNamingFunction(schema: JsonSchema): (element: Object) => string {
    if (this.uischema.options !== undefined) {
      const labelProvider = this.uischema.options.labelProvider;
      if (labelProvider !== undefined && labelProvider[schema.id] !== undefined) {
        return element => element[labelProvider[schema.id]];
      }
    }
    const namingKeys = Object.keys(schema.properties).filter(key => key === 'id' || key === 'name');
    if (namingKeys.length !== 0) {
      return element => element[namingKeys[0]];
    }

    return obj => JSON.stringify(obj);
  }

  /**
   * Updates the tree after a data object was added to property key of tree element li
   *
   * @param schema the JSON schema of the added data
   * @param key the key of the property that the data was added to
   * @param li the rendered list entry representing the parent object
   * @param newData the added data
   * @param deleteFunction function to allow deleting the data in the future
   */
  private updateTreeOnAdd(
    schema: JsonSchema,
    key: string,
    li: HTMLLIElement,
    newData: object,
    deleteFunction: (toDelete: object) => void
  ): void {
    // get UL lists that are direct children of li
    const childLists = _.filter(li.children, child => child.tagName === 'UL');
    let childParent;

    // find correct child group
    for (const list of childLists) {
      if (key === list.getAttribute('children')) {
        childParent = list;
        break;
      }
    }

    // In case no child group was found, create one
    if (childParent === undefined) {
      console.warn(`Could not find suitable list for key '${key}'. A new one was created.`);
      childParent = document.createElement('ul');
      childParent.setAttribute('children', key);
      li.appendChild(childParent);
    }

    this.expandObject(newData, childParent, schema,  deleteFunction);
  }

  /**
   * Renders a data object as a <li> child element of the given <ul> list.
   *
   * @param data The rendered data
   * @param parent The parent list to which the rendered element is added
   * @param schema The schema describing the rendered data's type
   * @param deleteFunction A function to delete the data from the model
   */
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
          if (_.startsWith(button.innerText, '#') && button.innerText.length > 1) {
            button.innerText = button.innerText.substr(1);
          }
          button.classList.add('jsf-treeMasterDetail-dialog-createbutton');
          JsonForms.stylingRegistry.addStyle(button, 'button');
          button.onclick = () => {
            const newData = {};
            // initialize new data with default values from schema
            Object.keys(property.schema.properties).forEach(key => {
              if (property.schema.properties[key].default) {
                newData[key] = property.schema.properties[key].default;
              }
            });
            property.addToData(data)(newData);
            this.updateTreeOnAdd(property.schema, property.property, li, newData,
                                 property.deleteFromData(data));
            this.dialog.close();
          };
          content.appendChild(button);
        });
        this.dialog.showModal();
        // Focus the close dialog's button
        this.dialog.getElementsByClassName('jsf-treeMasterDetail-dialog-button')[0].focus();
      };
      spanAdd.textContent = '\u2795';
      span.appendChild(spanAdd);
    }
    if (deleteFunction !== null) {
      const spanRemove = document.createElement('span');
      spanRemove.classList.add('remove');
      spanRemove.onclick = (ev: Event) => {
        ev.stopPropagation();
        this.treeNodeMapping.get(li).deleteFunction(data);
        this.treeNodeMapping.delete(li);
        li.remove();
        if (this.selected === li) {
          this.selectFirstElement();
        }
      };
      spanRemove.textContent = '\u274C';
      span.appendChild(spanRemove);
    }
    li.appendChild(div);

    const props = JsonForms.schemaService.getContainmentProperties(schema);
    const groupedProperties = _.groupBy(props, property => property.property);

    // create list for every property in the schema, unify anyOf
    Object.keys(groupedProperties).forEach(key => {
      // key is the name of the property that the data is contained in
      const properties = groupedProperties[key];
      const ul = document.createElement('ul') as HTMLUListElement;
      // get schema ids of objects allowed in this list
      let childrenIds = [];
      properties.forEach(property => {
        if (_.isEmpty(property.schema.id)) {
          console.warn(`The property's schema with label '${property.label}' has no schema id.
                        No proper Drag & Drop will be possible.`);

          return;
        }
        childrenIds = _.concat(childrenIds, property.schema.id);
      });
      ul.setAttribute('childrenIds', _.join(childrenIds, ' '));
      ul.setAttribute('children', key);
      li.appendChild(ul);
      registerDragAndDrop(this.master, this.treeNodeMapping, ul);
    });

    // map li to represented data, schema & delete function
    const nodeData: TreeNodeInfo = {
      data: data,
      schema: schema,
      deleteFunction: deleteFunction
    };
    this.treeNodeMapping.set(li, nodeData);

    // render contained children of this element
    Object.keys(groupedProperties).forEach(key => {
      const properties = groupedProperties[key];
      // resolved data is complete for every property in case of anyOf
      const propertyData = properties[0].getData(data) as Object[];
      if (!_.isEmpty(propertyData)) {
        this.renderChildren(propertyData, li, key);
      }
    });

    parent.appendChild(li);
  }

  /**
   * use the model mapping to match a data object to one ContainmentProperty out of a given list
   * of ContainmentProperties.
   */
  private matchContainmentProperty(data: Object, properties: ContainmentProperty[])
            : ContainmentProperty {
    if (properties.length === 1) {
      return properties[0];
    }
    // tslint:disable:no-string-literal
    if (!_.isEmpty(this.uischema.options) &&
      !_.isEmpty(this.uischema.options['modelMapping']) &&
      !_.isEmpty(this.uischema.options['modelMapping'].mapping)) {
        const filtered = properties.filter(property => {
          // only use filter criterion if the checked value has the mapped attribute
          if (data[this.uischema.options['modelMapping'].attribute]) {
            return property.schema.id === this.uischema.options['modelMapping'].
              mapping[data[this.uischema.options['modelMapping'].attribute]];
          }

          // NOTE if mapped attribute is not present do not filter out property
          return true;
        });
        // tslint:enable:no-string-literal
        // TODO improve handling
        if (filtered.length > 1) {
          console.warn('More than one matching containment property was found for the given data',
                       data);
        }

        return _.head(filtered);
    }

    console.error('Could not find containment property for data', data);

    // TODO should something else be returned?
    return null;
  }

  /**
   * @param li the LI element containing the lists
   * @param key the property key defining the searched lists content
   * @return the list for data belonging to the given key
   */
  private findRendererChildContainer(li: HTMLLIElement, key: string): HTMLUListElement {
    const children = _.filter(li.children, child => child.tagName === 'UL');
    for (const child of children) {
      if (child.getAttribute('children') === key) {
        return (child as HTMLUListElement);
      }
    }

    return undefined;
  }

  /**
   * Renders an array as children of the given <li> tree node.
   *
   * @param array the objects to render
   * @param li The parent tree node of the rendered objects
   * @param key The parent's property that contains the rendered children
   */
  private renderChildren
    (array: Object[], li: HTMLLIElement, key: string): void {
    // with unified lists, no need for schema id
    let ul: HTMLUListElement = this.findRendererChildContainer(li, key);
    if (ul === undefined) {
      console.warn(`No suitable list was found for key '${key}'.
                    Created a new one without drag and drop`);
      ul = document.createElement('ul');
      ul.setAttribute('children', key);
      li.appendChild(ul);
    }
    // clean list before re-rendering children
    while (!_.isEmpty(ul.firstChild)) {
      (ul.firstChild as Element).remove();
    }

    const parentInfo = this.treeNodeMapping.get(li);
    const parentProperties = JsonForms.schemaService.getContainmentProperties(parentInfo.schema);
    const keyProperties = parentProperties.filter(property => property.property === key);
    if (keyProperties.length > 1) {
      // anyOf
      const arrayProperties: ContainmentProperty[] = [];
      for (const dataObject of array) {
        // determine schema of dataObject with model mapping
        arrayProperties.push(this.matchContainmentProperty(dataObject, keyProperties));
      }
      this.expandArray(array, ul, arrayProperties, parentInfo.data);
    } else if (keyProperties.length === 1) {
      // no anyOf
      this.expandArray(array, ul, keyProperties[0], parentInfo.data);
    } else {
      console.error('Could not render children because no fitting property was found.');
    }
  }
}

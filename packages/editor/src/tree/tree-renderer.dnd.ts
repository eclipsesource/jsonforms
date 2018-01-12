// import { JsonForms } from '../../core';
import { SchemaService } from '../services/schema.service';
import { JsonSchema } from '@jsonforms/core';
import * as Sortable from 'sortablejs';
import * as _ from 'lodash';

export type TreeNodeInfo = {
  data: object, schema: JsonSchema,
  deleteFunction(toDelete: object): void
};

export const DROP_TARGET_CSS = 'jsf-dnd-drop-target';
export const CANCEL_DND_ATTRIBUTE = 'jsf-cancel-dnd';

/**
 * Returns a function that handles the sortablejs onRemove event
 */
export const dragAndDropRemoveHandler = (treeNodeMapping: Map<HTMLLIElement, TreeNodeInfo>,
  schemaService: SchemaService) => evt => {
    const li = evt.item as HTMLLIElement;
    // To be always consistent with add: use attribute set in add handler
    if (li.hasAttribute(CANCEL_DND_ATTRIBUTE)) {
      const from = evt.from as HTMLElement;
      if (from.children.length <= evt.oldIndex) {
        from.appendChild(li);
      } else {
        from.children.item(evt.oldIndex).insertAdjacentElement('beforebegin', li);
      }
      li.removeAttribute(CANCEL_DND_ATTRIBUTE);

      return;
    }

    const nodeData = treeNodeMapping.get(li);
    const nodeId = nodeData.schema.id;
    const oldParent = evt.from.parentNode as HTMLLIElement;
    const parentData = treeNodeMapping.get(oldParent);
    const properties = schemaService.getContainmentProperties(parentData.schema);
    for (const property of properties) {
      const propertyId = property.schema.id;
      if (propertyId === nodeId) {
        property.deleteFromData(parentData.data)(nodeData.data);

        return;
      }
    }
  };

/**
 * Returns a function that handles the SortableJs onUpdate event.
 * It is triggered when an element is moved inside a list.
 * It is not triggered when an element is dragged and then dropped at its original position.
 */
export const dragAndDropUpdateHandler = (treeNodeMapping: Map<HTMLLIElement, TreeNodeInfo>,
  schemaService: SchemaService) => evt => {
    // TODO check if adaption to unified list is necessary
    const li = evt.item as HTMLLIElement;
    const nodeInfo = treeNodeMapping.get(li);
    // NOTE does not work on root elements
    const parentLi = li.parentNode.parentNode as HTMLLIElement;
    const parentInfo = treeNodeMapping.get(parentLi);
    const properties = schemaService.getContainmentProperties(parentInfo.schema);
    const nodeId = nodeInfo.schema.id;

    for (const property of properties) {
      const propertyId = property.schema.id;
      if (propertyId !== nodeId) {
        continue;
      }
      property.deleteFromData(parentInfo.data)(nodeInfo.data);
      if (evt.newIndex > evt.oldIndex) {
        const neighbour = li.previousElementSibling as HTMLLIElement;
        const neighbourData = treeNodeMapping.get(neighbour).data;
        property.addToData(parentInfo.data)(nodeInfo.data, neighbourData, true);
      } else if (evt.newIndex < evt.oldIndex) {
        const neighbour = li.nextElementSibling as HTMLLIElement;
        const neighbourData = treeNodeMapping.get(neighbour).data;
        property.addToData(parentInfo.data)(nodeInfo.data, neighbourData, false);
      }

      return;
    }
  };

/**
 * Returns a function that handles the sortablejs onAdd Event.
 */
export const dragAndDropAddHandler = (treeNodeMapping: Map<HTMLLIElement, TreeNodeInfo>,
  schemaService: SchemaService) => evt => {
    const li = evt.item as HTMLLIElement;
    const nodeInfo = treeNodeMapping.get(li);
    const nodeId = nodeInfo.schema.id;
    const toList: HTMLUListElement = evt.to;
    const toListChildrenIds = _.split(toList.getAttribute('childrenIds'), ' ');

    // undo add in case it was not legal
    if (_.indexOf(toListChildrenIds, nodeId) < 0) {
      toList.removeChild(li);
      li.setAttribute(CANCEL_DND_ATTRIBUTE, '');

      return;
    }

    const newParent = evt.to.parentNode as HTMLLIElement;
    const parentInfo = treeNodeMapping.get(newParent);
    const properties = schemaService.getContainmentProperties(parentInfo.schema);

    /*
     * If the new data is not added at the end of the target list,
     * get the data that should follow the new data and use the fitting
     * containment property to add the new data.
     */
    for (const property of properties) {
      const propertyId = property.schema.id;
      if (propertyId === nodeId) {
        // NOTE: assume that a <ul> list only has <li> list elements as children
        // when this code is called: the added <li> is already part of the target <ul> list
        if (li.nextElementSibling !== null) {
          const neighbour = li.nextElementSibling as HTMLLIElement;
          const neighbourData = treeNodeMapping.get(neighbour).data;
          property.addToData(parentInfo.data)(nodeInfo.data, neighbourData, false);
        } else {
          property.addToData(parentInfo.data)(nodeInfo.data);
        }

        // if existing, update the moved element's delete function
        if (nodeInfo.deleteFunction !== undefined && nodeInfo.deleteFunction !== null) {
          const newDeleteFunction = property.deleteFromData(parentInfo.data);
          nodeInfo.deleteFunction = newDeleteFunction;
        }

        return;
      }
    }
    console.error('Failed Drag and Drop add due to missing property in target parent');
  };

/**
 * Returns a function that handles the SortableJs onStart event.
 * The function sets the CSS class jsf-dnd-drop-target to all lists
 * that are compatible to the dragged element.
 *
 * @param treeElement The HTML element containing the tree
 * @param id the id identifying the type of the list's elements that this handler is used for
 */
export const dragAndDropStartHandler =
  (treeElement: HTMLElement, treeNodeMapping: Map<HTMLLIElement, TreeNodeInfo>) => evt => {
    const lists = treeElement.getElementsByTagName('UL');
    const li = evt.item as HTMLLIElement;
    for (let i = 0; i < lists.length; i++) {
      const list = lists.item(i) as HTMLUListElement;
      const childrenIdsAttr = list.getAttribute('childrenIds');
      const id = treeNodeMapping.get(li).schema.id;
      if (_.isEmpty(id) || _.isEmpty(childrenIdsAttr)) {
        continue;
      }
      const childrenIdsArray = _.split(childrenIdsAttr, ' ');
      if (_.indexOf(childrenIdsArray, id) >= 0) {
        list.classList.toggle(DROP_TARGET_CSS, true);
      }
    }
  };

/**
 * Returns a function that handles the SortableJs onEnd event.
 * The function removes the CSS class jsf-dnd-drop-target from all lists.
 *
 * @param treeElement The HTML element containing the tree
 */
export const dragAndDropEndHandler = (treeElement: HTMLElement) => evt => {
  const lists = treeElement.getElementsByTagName('UL');
  for (let i = 0; i < lists.length; i++) {
    lists.item(i).classList.toggle(DROP_TARGET_CSS, false);
  }
};

/**
 * Activates drag and drop for all direct children of the given list.
 *
 * @param treeElement The HTML element containing the tree
 * @param treeNodeMapping maps the trees renderer li nodes to their represented data, schema,
 *        and delete function
 * @param schemaService The SchemaService
 * @param list the list that will support drag and drop
 */
export const registerDragAndDrop = (treeElement: HTMLElement,
  treeNodeMapping: Map<HTMLLIElement, TreeNodeInfo>, schemaService: SchemaService,
  list: HTMLUListElement) => {
  Sortable.create(list, {
    // groups with the same id allow to drag and drop elements between them
    group: 'jsf-dnd',
    // called after dragging started
    onStart: dragAndDropStartHandler(treeElement, treeNodeMapping),
    // called after an element was added from another list
    onAdd: dragAndDropAddHandler(treeNodeMapping, schemaService),
    // called when an element's position is changed within the same list
    onUpdate: dragAndDropUpdateHandler(treeNodeMapping, schemaService),
    // called when an element is removed because it was moved to another list
    onRemove: dragAndDropRemoveHandler(treeNodeMapping, schemaService),
    // called after dragging ended
    onEnd: dragAndDropEndHandler(treeElement)
  });
};

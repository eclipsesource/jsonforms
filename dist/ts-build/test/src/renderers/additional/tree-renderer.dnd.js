"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("../../core");
const Sortable = require("sortablejs");
/**
 * Returns a function that handles the sortablejs onRemove event
 */
exports.dragAndDropRemoveHandler = (treeNodeMapping) => evt => {
    const li = evt.item;
    const nodeData = treeNodeMapping.get(li);
    const oldParent = evt.from.parentNode;
    const parentData = treeNodeMapping.get(oldParent);
    const properties = core_1.JsonForms.schemaService.getContainmentProperties(parentData.schema);
    const nodeId = nodeData.schema.id;
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
exports.dragAndDropUpdateHandler = (treeNodeMapping) => evt => {
    const li = evt.item;
    const nodeInfo = treeNodeMapping.get(li);
    // NOTE does not work on root elements
    const parentLi = li.parentNode.parentNode;
    const parentInfo = treeNodeMapping.get(parentLi);
    const properties = core_1.JsonForms.schemaService.getContainmentProperties(parentInfo.schema);
    const nodeId = nodeInfo.schema.id;
    for (const property of properties) {
        const propertyId = property.schema.id;
        if (propertyId !== nodeId) {
            continue;
        }
        property.deleteFromData(parentInfo.data)(nodeInfo.data);
        if (evt.newIndex > evt.oldIndex) {
            const neighbour = li.previousElementSibling;
            const neighbourData = treeNodeMapping.get(neighbour).data;
            property.addToData(parentInfo.data)(nodeInfo.data, neighbourData, true);
        }
        else if (evt.newIndex < evt.oldIndex) {
            const neighbour = li.nextElementSibling;
            const neighbourData = treeNodeMapping.get(neighbour).data;
            property.addToData(parentInfo.data)(nodeInfo.data, neighbourData, false);
        }
        return;
    }
};
/**
 * Returns a function that handles the sortablejs onAdd Event.
 */
exports.dragAndDropAddHandler = (treeNodeMapping) => evt => {
    const li = evt.item;
    const nodeInfo = treeNodeMapping.get(li);
    const newParent = evt.to.parentNode;
    const parentInfo = treeNodeMapping.get(newParent);
    const properties = core_1.JsonForms.schemaService.getContainmentProperties(parentInfo.schema);
    const nodeId = nodeInfo.schema.id;
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
                const neighbour = li.nextElementSibling;
                const neighbourData = treeNodeMapping.get(neighbour).data;
                property.addToData(parentInfo.data)(nodeInfo.data, neighbourData, false);
            }
            else {
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
    // TODO proper logging
    console.error('Failed Drag and Drop add due to missing property in target parent');
};
/**
 * Activates drag and drop for all direct children of the given list.
 *
 * @param treeNodeMapping maps the trees renderer li nodes to their represented data, schema,
 *        and delete function
 * @param list the list that will support drag and drop
 * @param id the id identifying the type of the list's elements
 */
exports.registerDnDWithGroupId = (treeNodeMapping, list, id) => {
    Sortable.create(list, {
        // groups with the same id allow to drag and drop elements between them
        group: id,
        // called after an element was added from another list
        onAdd: exports.dragAndDropAddHandler(treeNodeMapping),
        // called when an element's position is changed within the same list
        onUpdate: exports.dragAndDropUpdateHandler(treeNodeMapping),
        // called when an element is removed because it was moved to another list
        onRemove: exports.dragAndDropRemoveHandler(treeNodeMapping)
    });
};
//# sourceMappingURL=tree-renderer.dnd.js.map
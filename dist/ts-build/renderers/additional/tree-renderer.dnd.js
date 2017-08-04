"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("../../core");
var Sortable = require("sortablejs");
/**
 * Returns a function that handles the sortablejs onRemove event
 */
exports.dragAndDropRemoveHandler = function (treeNodeMapping) {
    return function (evt) {
        var li = evt.item;
        var nodeData = treeNodeMapping.get(li);
        var oldParent = evt.from.parentNode;
        var parentData = treeNodeMapping.get(oldParent);
        var properties = core_1.JsonForms.schemaService.getContainmentProperties(parentData.schema);
        var nodeId = nodeData.schema.id;
        for (var _i = 0, properties_1 = properties; _i < properties_1.length; _i++) {
            var property = properties_1[_i];
            var propertyId = property.schema.id;
            if (propertyId === nodeId) {
                property.deleteFromData(parentData.data)(nodeData.data);
                return;
            }
        }
    };
};
/**
 * Returns a function that handles the SortableJs onUpdate event.
 * It is triggered when an element is moved inside a list.
 * It is not triggered when an element is dragged and then dropped at its original position.
 */
exports.dragAndDropUpdateHandler = function (treeNodeMapping) {
    return function (evt) {
        var li = evt.item;
        var nodeInfo = treeNodeMapping.get(li);
        // NOTE does not work on root elements
        var parentLi = li.parentNode.parentNode;
        var parentInfo = treeNodeMapping.get(parentLi);
        var properties = core_1.JsonForms.schemaService.getContainmentProperties(parentInfo.schema);
        var nodeId = nodeInfo.schema.id;
        for (var _i = 0, properties_2 = properties; _i < properties_2.length; _i++) {
            var property = properties_2[_i];
            var propertyId = property.schema.id;
            if (propertyId !== nodeId) {
                continue;
            }
            property.deleteFromData(parentInfo.data)(nodeInfo.data);
            if (evt.newIndex > evt.oldIndex) {
                var neighbour = li.previousElementSibling;
                var neighbourData = treeNodeMapping.get(neighbour).data;
                property.addToData(parentInfo.data)(nodeInfo.data, neighbourData, true);
            }
            else if (evt.newIndex < evt.oldIndex) {
                var neighbour = li.nextElementSibling;
                var neighbourData = treeNodeMapping.get(neighbour).data;
                property.addToData(parentInfo.data)(nodeInfo.data, neighbourData, false);
            }
            return;
        }
    };
};
/**
 * Returns a function that handles the sortablejs onAdd Event.
 */
exports.dragAndDropAddHandler = function (treeNodeMapping) {
    return function (evt) {
        var li = evt.item;
        var nodeInfo = treeNodeMapping.get(li);
        var newParent = evt.to.parentNode;
        var parentInfo = treeNodeMapping.get(newParent);
        var properties = core_1.JsonForms.schemaService.getContainmentProperties(parentInfo.schema);
        var nodeId = nodeInfo.schema.id;
        /*
         * If the new data is not added at the end of the target list,
         * get the data that should follow the new data and use the fitting
         * containment property to add the new data.
         */
        for (var _i = 0, properties_3 = properties; _i < properties_3.length; _i++) {
            var property = properties_3[_i];
            var propertyId = property.schema.id;
            if (propertyId === nodeId) {
                // NOTE: assume that a <ul> list only has <li> list elements as children
                // when this code is called: the added <li> is already part of the target <ul> list
                if (li.nextElementSibling !== null) {
                    var neighbour = li.nextElementSibling;
                    var neighbourData = treeNodeMapping.get(neighbour).data;
                    property.addToData(parentInfo.data)(nodeInfo.data, neighbourData, false);
                }
                else {
                    property.addToData(parentInfo.data)(nodeInfo.data);
                }
                // if existing, update the moved element's delete function
                if (nodeInfo.deleteFunction !== undefined && nodeInfo.deleteFunction !== null) {
                    var newDeleteFunction = property.deleteFromData(parentInfo.data);
                    nodeInfo.deleteFunction = newDeleteFunction;
                }
                return;
            }
        }
        // TODO proper logging
        console.error('Failed Drag and Drop add due to missing property in target parent');
    };
};
/**
 * Activates drag and drop for all direct children of the given list.
 *
 * @param treeNodeMapping maps the trees renderer li nodes to their represented data, schema,
 *        and delete function
 * @param list the list that will support drag and drop
 * @param id the id identifying the type of the list's elements
 */
exports.registerDnDWithGroupId = function (treeNodeMapping, list, id) {
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
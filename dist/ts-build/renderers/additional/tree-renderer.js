"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:max-file-line-count */
var _ = require("lodash");
var renderer_1 = require("../../core/renderer");
var renderer_util_1 = require("../renderer.util");
var path_util_1 = require("../../path.util");
var testers_1 = require("../../core/testers");
var runtime_1 = require("../../core/runtime");
var core_1 = require("../../core");
var tree_renderer_dnd_1 = require("./tree-renderer.dnd");
/**
 * Default tester for a master-detail layout.
 * @type {RankedTester}
 */
exports.treeMasterDetailTester = testers_1.rankWith(1, testers_1.and(testers_1.uiTypeIs('MasterDetailLayout'), function (uiSchema) {
    var control = uiSchema;
    if (control.scope === undefined || control.scope === null) {
        return false;
    }
    return !(control.scope.$ref === undefined || control.scope.$ref === null);
}));
/**
 * Default renderer for a tree-based master-detail layout.
 */
var TreeMasterDetailRenderer = (function (_super) {
    __extends(TreeMasterDetailRenderer, _super);
    function TreeMasterDetailRenderer() {
        var _this = _super.call(this) || this;
        _this.addingToRoot = false;
        /** maps tree nodes (<li>) to their represented data, and schema delete function */
        _this.treeNodeMapping = new Map();
        return _this;
    }
    TreeMasterDetailRenderer.prototype.connectedCallback = function () {
        _super.prototype.connectedCallback.call(this);
        this.dataService.registerDataChangeListener(this);
    };
    TreeMasterDetailRenderer.prototype.disconnectedCallback = function () {
        this.dataService.deregisterDataChangeListener(this);
        _super.prototype.disconnectedCallback.call(this);
    };
    TreeMasterDetailRenderer.prototype.dispose = function () {
        // Do nothing
    };
    TreeMasterDetailRenderer.prototype.runtimeUpdated = function (type) {
        var runtime = this.uischema.runtime;
        switch (type) {
            case runtime_1.RUNTIME_TYPE.VISIBLE:
                this.hidden = !runtime.visible;
                break;
            case runtime_1.RUNTIME_TYPE.ENABLED:
                if (!runtime.enabled) {
                    this.setAttribute('disabled', 'true');
                }
                else {
                    this.removeAttribute('disabled');
                }
                break;
            default:
        }
    };
    TreeMasterDetailRenderer.prototype.render = function () {
        var _this = this;
        var controlElement = this.uischema;
        this.resolvedSchema = path_util_1.resolveSchema(this.dataSchema, controlElement.scope.$ref);
        this.className = 'jsf-treeMasterDetail';
        var divHeader = document.createElement('div');
        divHeader.className = 'jsf-treeMasterDetail-header';
        var label = document.createElement('label');
        if (typeof controlElement.label === 'string') {
            label.textContent = controlElement.label;
        }
        divHeader.appendChild(label);
        var rootData = this.dataService.getValue(controlElement);
        if (Array.isArray(rootData)) {
            var button = document.createElement('button');
            button.textContent = 'Add to root';
            button.onclick = function (ev) {
                if (!Array.isArray(_this.dataSchema.items)) {
                    var newData = {};
                    _this.addingToRoot = true;
                    var length_1 = rootData.push(newData);
                    _this.dataService.notifyAboutDataChange(controlElement, rootData);
                    _this.expandObject(newData, _this.master.firstChild, _this.dataSchema.items, function () { return rootData.splice(length_1 - 1, 1); });
                    _this.addingToRoot = false;
                }
            };
            divHeader.appendChild(button);
        }
        this.appendChild(divHeader);
        var div = document.createElement('div');
        div.className = 'jsf-treeMasterDetail-content';
        this.master = document.createElement('div');
        this.master.className = 'jsf-treeMasterDetail-master';
        div.appendChild(this.master);
        this.detail = document.createElement('div');
        this.detail.className = 'jsf-treeMasterDetail-detail';
        div.appendChild(this.detail);
        this.appendChild(div);
        this.dialog = document.createElement('dialog');
        var title = document.createElement('label');
        title.innerText = 'Select the Item to create:';
        this.dialog.appendChild(title);
        var dialogContent = document.createElement('div');
        dialogContent.classList.add('content');
        this.dialog.appendChild(dialogContent);
        var dialogClose = document.createElement('button');
        dialogClose.innerText = 'Close';
        dialogClose.onclick = function () { return _this.dialog.close(); };
        this.dialog.appendChild(dialogClose);
        this.appendChild(this.dialog);
        this.renderFull();
        this.classList.add(this.convertToClassName(controlElement.scope.$ref));
        return this;
    };
    TreeMasterDetailRenderer.prototype.needsNotificationAbout = function (uischema) {
        return uischema === undefined || uischema === null ? false :
            this.uischema.scope.$ref === uischema.scope.$ref
                && !this.addingToRoot;
    };
    TreeMasterDetailRenderer.prototype.dataChanged = function (uischema, newValue, data) {
        this.renderFull();
    };
    TreeMasterDetailRenderer.prototype.renderFull = function () {
        this.renderMaster(this.resolvedSchema);
        this.selectFirstElement();
    };
    TreeMasterDetailRenderer.prototype.selectFirstElement = function () {
        var controlElement = this.uischema;
        var arrayData = this.dataService.getValue(controlElement);
        if (arrayData !== undefined && arrayData !== null && arrayData.length !== 0) {
            var firstChild = arrayData;
            var schema = this.resolvedSchema;
            if (Array.isArray(firstChild) && !Array.isArray(schema.items)) {
                firstChild = firstChild[0];
                schema = schema.items;
            }
            this.renderDetail(firstChild, this.master.firstChild.firstChild, schema);
        }
    };
    TreeMasterDetailRenderer.prototype.renderMaster = function (schema) {
        if (this.master.lastChild !== null) {
            this.master.removeChild(this.master.lastChild);
        }
        var controlElement = this.uischema;
        var rootData = this.dataService.getValue(controlElement);
        // TODO: so far no drag and drop on root level
        var ul = document.createElement('ul');
        if (schema.items !== undefined) {
            this.expandRootArray(rootData, ul, schema.items);
        }
        else {
            this.expandObject(rootData, ul, schema, null);
        }
        this.master.appendChild(ul);
    };
    /**
     * Expands the given array of root elements by expanding every element.
     * It is assumed that the roor elements do not support drag and drop.
     * Based on this, a delete function is created for every element.
     *
     * @param data the array to expand
     * @param parent the list that will contain the expanded elements
     * @param schema the {@link JsonSchema} defining the elements' type
     */
    TreeMasterDetailRenderer.prototype.expandRootArray = function (data, parent, schema) {
        var _this = this;
        if (data === undefined || data === null) {
            return;
        }
        data.forEach(function (element, index) {
            _this.expandObject(element, parent, schema, function () { return data.splice(index, 1); });
        });
    };
    /**
     * Expands the given data array by expanding every element.
     * If the parent data containing the array is provided,
     * a suitable delete function for the expanded elements is created.
     *
     * @param data the array to expand
     * @param parent the list that will contain the expanded elements
     * @param property the {@link ContainmentProperty} defining the property that the array belongs to
     * @param parentData the data containing the array as a property
     */
    TreeMasterDetailRenderer.prototype.expandArray = function (data, parent, property, parentData) {
        var _this = this;
        if (data === undefined || data === null) {
            return;
        }
        data.forEach(function (element, index) {
            var deleteFunction = null;
            if (!_.isEmpty(parentData)) {
                deleteFunction = property.deleteFromData(parentData);
            }
            _this.expandObject(element, parent, property.schema, deleteFunction);
        });
    };
    TreeMasterDetailRenderer.prototype.getNamingFunction = function (schema) {
        if (this.uischema.options !== undefined) {
            var labelProvider_1 = this.uischema.options.labelProvider;
            if (labelProvider_1 !== undefined && labelProvider_1[schema.id] !== undefined) {
                return function (element) { return element[labelProvider_1[schema.id]]; };
            }
        }
        var namingKeys = Object.keys(schema.properties).filter(function (key) { return key === 'id' || key === 'name'; });
        if (namingKeys.length !== 0) {
            return function (element) { return element[namingKeys[0]]; };
        }
        return function (obj) { return JSON.stringify(obj); };
    };
    /**
     * Updates the tree after a data object was added to property key of tree element li
     *
     * @param schema the JSON schema of the added data
     * @param key the key of the property that the data was added to
     * @param li the rendered list entry representing the parent object
     * @param newData the added data
     * @param deleteFunction function to allow deleting the data in the future
     */
    TreeMasterDetailRenderer.prototype.updateTreeOnAdd = function (schema, key, li, newData, deleteFunction) {
        var subChildren = li.getElementsByTagName('ul');
        var childParent;
        // find correct child group
        if (subChildren.length !== 0) {
            for (var i = 0; i < subChildren.length; i++) {
                if (li !== subChildren[i].parentNode) {
                    // only lists that are direct children of li are relevant
                    continue;
                }
                if (schema.id === undefined || schema.id === null) {
                    // If the schema has no id, see if there is a group matching the key
                    if (key === subChildren[i].getAttribute('childrenId')
                        && subChildren[i].getAttribute('childrenId') === undefined) {
                        childParent = subChildren[i];
                    }
                    continue;
                }
                if (schema.id === subChildren[i].getAttribute('childrenId')) {
                    childParent = subChildren[i];
                    break;
                }
            }
        }
        // In case no child group was found, create one
        if (childParent === undefined) {
            // TODO proper logging
            console.warn('Could not find suitable list for key ' + key
                + '. A new one was created.');
            childParent = document.createElement('ul');
            childParent.setAttribute('children', key);
            li.appendChild(childParent);
        }
        this.expandObject(newData, childParent, schema, deleteFunction);
    };
    /**
     * Renders a data object as a <li> child element of the given <ul> list.
     *
     * @param data The rendered data
     * @param parent The parent list to which the rendered element is added
     * @param schema The schema describing the rendered data's type
     * @param deleteFunction A function to delete the data from the model
     */
    TreeMasterDetailRenderer.prototype.expandObject = function (data, parent, schema, deleteFunction) {
        var _this = this;
        var li = document.createElement('li');
        var div = document.createElement('div');
        if (this.uischema.options !== undefined &&
            this.uischema.options.imageProvider !== undefined) {
            var spanIcon = document.createElement('span');
            spanIcon.classList.add('icon');
            spanIcon.classList.add(this.uischema.options.imageProvider[schema.id]);
            div.appendChild(spanIcon);
        }
        var span = document.createElement('span');
        span.classList.add('label');
        span.onclick = function (ev) {
            _this.renderDetail(data, li, schema);
        };
        var spanText = document.createElement('span');
        spanText.textContent = this.getNamingFunction(schema)(data);
        span.appendChild(spanText);
        div.appendChild(span);
        if (core_1.JsonForms.schemaService.hasContainmentProperties(schema)) {
            var spanAdd = document.createElement('span');
            spanAdd.classList.add('add');
            spanAdd.onclick = function (ev) {
                ev.stopPropagation();
                var content = _this.dialog.getElementsByClassName('content')[0];
                while (content.firstChild) {
                    content.firstChild.remove();
                }
                core_1.JsonForms.schemaService.getContainmentProperties(schema).forEach(function (property) {
                    var button = document.createElement('button');
                    button.innerText = property.label;
                    button.onclick = function () {
                        var newData = {};
                        // initialize new data with default values from schema
                        Object.keys(property.schema.properties).forEach(function (key) {
                            if (property.schema.properties[key].default) {
                                newData[key] = property.schema.properties[key].default;
                            }
                        });
                        property.addToData(data)(newData);
                        _this.updateTreeOnAdd(property.schema, property.property, li, newData, property.deleteFromData(data));
                        _this.dialog.close();
                    };
                    content.appendChild(button);
                });
                _this.dialog.showModal();
            };
            spanAdd.textContent = '\u2795';
            span.appendChild(spanAdd);
        }
        if (deleteFunction !== null) {
            var spanRemove = document.createElement('span');
            spanRemove.classList.add('remove');
            spanRemove.onclick = function (ev) {
                ev.stopPropagation();
                _this.treeNodeMapping.get(li).deleteFunction(data);
                _this.treeNodeMapping.delete(li);
                li.remove();
                if (_this.selected === li) {
                    _this.selectFirstElement();
                }
            };
            spanRemove.textContent = '\u274C';
            span.appendChild(spanRemove);
        }
        li.appendChild(div);
        // add a separate list for each containment property
        core_1.JsonForms.schemaService.getContainmentProperties(schema).forEach(function (property) {
            var id = property.schema.id;
            if (id === undefined || id === null) {
                // TODO proper logging
                console.warn('The property\'s schema with label \'' + property.label
                    + '\' has no id. No Drag & Drop is possible.');
                return;
            }
            // create child list and activate drag and drop
            var ul = document.createElement('ul');
            ul.setAttribute('childrenId', id);
            ul.setAttribute('children', property.property);
            tree_renderer_dnd_1.registerDnDWithGroupId(_this.treeNodeMapping, ul, id);
            li.appendChild(ul);
        });
        // map li to represented data & delete function
        var nodeData = {
            data: data,
            schema: schema,
            deleteFunction: deleteFunction
        };
        this.treeNodeMapping.set(li, nodeData);
        // TODO: too much rendering for anyOf containments without id mapping.
        // elements that are part of an 'anyOf' containment but are not mapped to an id
        // will be rendered in every list for the anyOf.
        // render contained children of this element
        core_1.JsonForms.schemaService.getContainmentProperties(schema).forEach(function (property) {
            var propertyData = property.getData(data);
            /*tslint:disable:no-string-literal */
            if (_this.uischema.options !== undefined &&
                _this.uischema.options['modelMapping'] !== undefined && !_.isEmpty(propertyData)) {
                propertyData = propertyData.filter(function (value) {
                    // only use filter criterion if the checked value has the mapped attribute
                    if (value[_this.uischema.options['modelMapping'].attribute]) {
                        return property.schema.id === _this.uischema.options['modelMapping'].
                            mapping[value[_this.uischema.options['modelMapping'].attribute]];
                    }
                    return true;
                });
            }
            /*tslint:enable:no-string-literal */
            if (!_.isEmpty(propertyData)) {
                _this.renderChildren(propertyData, property.schema, li, property.property);
            }
        });
        parent.appendChild(li);
    };
    TreeMasterDetailRenderer.prototype.findRendererChildContainer = function (li, key, id) {
        // If an id is provided, the group must match key and id. Otherwise only the key.
        var ul;
        var children = li.children;
        for (var i = 0; i < children.length; i++) {
            var child = children.item(i);
            if (child.tagName === 'UL' && child.getAttribute('children') === key) {
                if (!_.isEmpty(id) && child.getAttribute('childrenId') === id) {
                    ul = child;
                }
                else if (_.isEmpty(id)) {
                    ul = child;
                }
            }
        }
        return ul;
    };
    /**
     * Renders an array as children of the given <li> tree node.
     *
     * @param array the objects to render
     * @param schema the JsonSchema describing the objects
     * @param li The parent tree node of the rendered objects
     * @param key The parent's property that contains the rendered children
     */
    TreeMasterDetailRenderer.prototype.renderChildren = function (array, schema, li, key) {
        var ul = this.findRendererChildContainer(li, key, schema.id);
        if (ul === undefined) {
            // TODO proper logging
            console.warn('No suitable list was found for key \'' + key + '\'.');
            ul = document.createElement('ul');
            ul.setAttribute('children', key);
            if (!_.isEmpty(schema.id)) {
                ul.setAttribute('childrenId', schema.id);
                tree_renderer_dnd_1.registerDnDWithGroupId(this.treeNodeMapping, ul, schema.id);
            }
            li.appendChild(ul);
        }
        else {
            while (!_.isEmpty(ul.firstChild)) {
                ul.firstChild.remove();
            }
        }
        var parentInfo = this.treeNodeMapping.get(li);
        var parentProperties = core_1.JsonForms.schemaService.getContainmentProperties(parentInfo.schema);
        for (var _i = 0, parentProperties_1 = parentProperties; _i < parentProperties_1.length; _i++) {
            var property = parentProperties_1[_i];
            // If available, additionally use schema id to identify the correct property
            if (!_.isEmpty(schema.id) && schema.id !== property.schema.id) {
                continue;
            }
            if (key === property.property) {
                this.expandArray(array, ul, property, parentInfo.data);
                return;
            }
        }
        // TODO proper logging
        console.warn('Could not render children because no fitting property was found.');
    };
    TreeMasterDetailRenderer.prototype.renderDetail = function (element, label, schema) {
        var _this = this;
        if (this.detail.lastChild !== null) {
            this.detail.removeChild(this.detail.lastChild);
        }
        if (this.selected !== undefined) {
            this.selected.classList.toggle('selected');
        }
        label.classList.toggle('selected');
        this.selected = label;
        var jsonForms = document.createElement('json-forms');
        jsonForms.data = element;
        jsonForms.dataSchema = schema;
        // NOTE check needed for tests
        if (jsonForms.addDataChangeListener !== undefined && jsonForms.addDataChangeListener !== null) {
            jsonForms.addDataChangeListener({
                needsNotificationAbout: function (uischema) {
                    return uischema !== null;
                },
                dataChanged: function (uischema, newValue, data) {
                    var segments = uischema.scope.$ref.split('/');
                    var lastSegemnet = segments[segments.length - 1];
                    if (lastSegemnet === _this.uischema.options.labelProvider[schema.id]) {
                        label.firstChild.lastChild.firstChild.textContent = newValue;
                    }
                    if (Array.isArray(newValue)) {
                        var childSchema = path_util_1.resolveSchema(schema, uischema.scope.$ref).items;
                        if (!Array.isArray(childSchema)) {
                            _this.renderChildren(newValue, childSchema, label, lastSegemnet);
                        }
                    }
                }
            });
        }
        this.detail.appendChild(jsonForms);
    };
    TreeMasterDetailRenderer = __decorate([
        renderer_util_1.JsonFormsRenderer({
            selector: 'jsonforms-tree',
            tester: testers_1.rankWith(1, testers_1.uiTypeIs('MasterDetailLayout'))
        }),
        __metadata("design:paramtypes", [])
    ], TreeMasterDetailRenderer);
    return TreeMasterDetailRenderer;
}(renderer_1.Renderer));
exports.TreeMasterDetailRenderer = TreeMasterDetailRenderer;
//# sourceMappingURL=tree-renderer.js.map
"use strict";
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
const _ = require("lodash");
const renderer_1 = require("../../core/renderer");
const renderer_util_1 = require("../renderer.util");
const path_util_1 = require("../../path.util");
const testers_1 = require("../../core/testers");
const runtime_1 = require("../../core/runtime");
const core_1 = require("../../core");
const tree_renderer_dnd_1 = require("./tree-renderer.dnd");
/**
 * Default tester for a master-detail layout.
 * @type {RankedTester}
 */
exports.treeMasterDetailTester = testers_1.rankWith(1, testers_1.and(testers_1.uiTypeIs('MasterDetailLayout'), uiSchema => {
    const control = uiSchema;
    if (control.scope === undefined || control.scope === null) {
        return false;
    }
    return !(control.scope.$ref === undefined || control.scope.$ref === null);
}));
/**
 * Default renderer for a tree-based master-detail layout.
 */
let TreeMasterDetailRenderer = class TreeMasterDetailRenderer extends renderer_1.Renderer {
    constructor() {
        super();
        this.addingToRoot = false;
        /** maps tree nodes (<li>) to their represented data, and schema delete function */
        this.treeNodeMapping = new Map();
    }
    connectedCallback() {
        super.connectedCallback();
        this.dataService.registerDataChangeListener(this);
    }
    disconnectedCallback() {
        this.dataService.deregisterDataChangeListener(this);
        super.disconnectedCallback();
    }
    dispose() {
        // Do nothing
    }
    runtimeUpdated(type) {
        const runtime = this.uischema.runtime;
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
    }
    render() {
        const controlElement = this.uischema;
        this.resolvedSchema = path_util_1.resolveSchema(this.dataSchema, controlElement.scope.$ref);
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
            button.onclick = (ev) => {
                if (!Array.isArray(this.dataSchema.items)) {
                    const newData = {};
                    this.addingToRoot = true;
                    const length = rootData.push(newData);
                    this.dataService.notifyAboutDataChange(controlElement, rootData);
                    this.expandObject(newData, this.master.firstChild, this.dataSchema.items, () => rootData.splice(length - 1, 1));
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
        this.classList.add(this.convertToClassName(controlElement.scope.$ref));
        return this;
    }
    needsNotificationAbout(uischema) {
        return uischema === undefined || uischema === null ? false :
            this.uischema.scope.$ref === uischema.scope.$ref
                && !this.addingToRoot;
    }
    dataChanged(uischema, newValue, data) {
        this.renderFull();
    }
    renderFull() {
        this.renderMaster(this.resolvedSchema);
        this.selectFirstElement();
    }
    selectFirstElement() {
        const controlElement = this.uischema;
        const arrayData = this.dataService.getValue(controlElement);
        if (arrayData !== undefined && arrayData !== null && arrayData.length !== 0) {
            let firstChild = arrayData;
            let schema = this.resolvedSchema;
            if (Array.isArray(firstChild) && !Array.isArray(schema.items)) {
                firstChild = firstChild[0];
                schema = schema.items;
            }
            this.renderDetail(firstChild, this.master.firstChild.firstChild, schema);
        }
    }
    renderMaster(schema) {
        if (this.master.lastChild !== null) {
            this.master.removeChild(this.master.lastChild);
        }
        const controlElement = this.uischema;
        const rootData = this.dataService.getValue(controlElement);
        // TODO: so far no drag and drop on root level
        const ul = document.createElement('ul');
        if (schema.items !== undefined) {
            this.expandRootArray(rootData, ul, schema.items);
        }
        else {
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
    expandRootArray(data, parent, schema) {
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
     * @param parentData the data containing the array as a property
     */
    expandArray(data, parent, property, parentData) {
        if (data === undefined || data === null) {
            return;
        }
        data.forEach((element, index) => {
            let deleteFunction = null;
            if (!_.isEmpty(parentData)) {
                deleteFunction = property.deleteFromData(parentData);
            }
            this.expandObject(element, parent, property.schema, deleteFunction);
        });
    }
    getNamingFunction(schema) {
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
    updateTreeOnAdd(schema, key, li, newData, deleteFunction) {
        const subChildren = li.getElementsByTagName('ul');
        let childParent;
        // find correct child group
        if (subChildren.length !== 0) {
            for (let i = 0; i < subChildren.length; i++) {
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
    }
    /**
     * Renders a data object as a <li> child element of the given <ul> list.
     *
     * @param data The rendered data
     * @param parent The parent list to which the rendered element is added
     * @param schema The schema describing the rendered data's type
     * @param deleteFunction A function to delete the data from the model
     */
    expandObject(data, parent, schema, deleteFunction) {
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
        span.onclick = (ev) => {
            this.renderDetail(data, li, schema);
        };
        const spanText = document.createElement('span');
        spanText.textContent = this.getNamingFunction(schema)(data);
        span.appendChild(spanText);
        div.appendChild(span);
        if (core_1.JsonForms.schemaService.hasContainmentProperties(schema)) {
            const spanAdd = document.createElement('span');
            spanAdd.classList.add('add');
            spanAdd.onclick = (ev) => {
                ev.stopPropagation();
                const content = this.dialog.getElementsByClassName('content')[0];
                while (content.firstChild) {
                    content.firstChild.remove();
                }
                core_1.JsonForms.schemaService.getContainmentProperties(schema).forEach(property => {
                    const button = document.createElement('button');
                    button.innerText = property.label;
                    button.onclick = () => {
                        const newData = {};
                        // initialize new data with default values from schema
                        Object.keys(property.schema.properties).forEach(key => {
                            if (property.schema.properties[key].default) {
                                newData[key] = property.schema.properties[key].default;
                            }
                        });
                        property.addToData(data)(newData);
                        this.updateTreeOnAdd(property.schema, property.property, li, newData, property.deleteFromData(data));
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
            spanRemove.onclick = (ev) => {
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
        // add a separate list for each containment property
        core_1.JsonForms.schemaService.getContainmentProperties(schema).forEach(property => {
            const id = property.schema.id;
            if (id === undefined || id === null) {
                // TODO proper logging
                console.warn('The property\'s schema with label \'' + property.label
                    + '\' has no id. No Drag & Drop is possible.');
                return;
            }
            // create child list and activate drag and drop
            const ul = document.createElement('ul');
            ul.setAttribute('childrenId', id);
            ul.setAttribute('children', property.property);
            tree_renderer_dnd_1.registerDnDWithGroupId(this.treeNodeMapping, ul, id);
            li.appendChild(ul);
        });
        // map li to represented data & delete function
        const nodeData = {
            data: data,
            schema: schema,
            deleteFunction: deleteFunction
        };
        this.treeNodeMapping.set(li, nodeData);
        // TODO: too much rendering for anyOf containments without id mapping.
        // elements that are part of an 'anyOf' containment but are not mapped to an id
        // will be rendered in every list for the anyOf.
        // render contained children of this element
        core_1.JsonForms.schemaService.getContainmentProperties(schema).forEach(property => {
            let propertyData = property.getData(data);
            /*tslint:disable:no-string-literal */
            if (this.uischema.options !== undefined &&
                this.uischema.options['modelMapping'] !== undefined && !_.isEmpty(propertyData)) {
                propertyData = propertyData.filter(value => {
                    // only use filter criterion if the checked value has the mapped attribute
                    if (value[this.uischema.options['modelMapping'].attribute]) {
                        return property.schema.id === this.uischema.options['modelMapping'].
                            mapping[value[this.uischema.options['modelMapping'].attribute]];
                    }
                    return true;
                });
            }
            /*tslint:enable:no-string-literal */
            if (!_.isEmpty(propertyData)) {
                this.renderChildren(propertyData, property.schema, li, property.property);
            }
        });
        parent.appendChild(li);
    }
    findRendererChildContainer(li, key, id) {
        // If an id is provided, the group must match key and id. Otherwise only the key.
        let ul;
        const children = li.children;
        for (let i = 0; i < children.length; i++) {
            const child = children.item(i);
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
    }
    /**
     * Renders an array as children of the given <li> tree node.
     *
     * @param array the objects to render
     * @param schema the JsonSchema describing the objects
     * @param li The parent tree node of the rendered objects
     * @param key The parent's property that contains the rendered children
     */
    renderChildren(array, schema, li, key) {
        let ul = this.findRendererChildContainer(li, key, schema.id);
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
        const parentInfo = this.treeNodeMapping.get(li);
        const parentProperties = core_1.JsonForms.schemaService.getContainmentProperties(parentInfo.schema);
        for (const property of parentProperties) {
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
    }
    renderDetail(element, label, schema) {
        if (this.detail.lastChild !== null) {
            this.detail.removeChild(this.detail.lastChild);
        }
        if (this.selected !== undefined) {
            this.selected.classList.toggle('selected');
        }
        label.classList.toggle('selected');
        this.selected = label;
        const jsonForms = document.createElement('json-forms');
        jsonForms.data = element;
        jsonForms.dataSchema = schema;
        // NOTE check needed for tests
        if (jsonForms.addDataChangeListener !== undefined && jsonForms.addDataChangeListener !== null) {
            jsonForms.addDataChangeListener({
                needsNotificationAbout: (uischema) => {
                    return uischema !== null;
                },
                dataChanged: (uischema, newValue, data) => {
                    const segments = uischema.scope.$ref.split('/');
                    const lastSegemnet = segments[segments.length - 1];
                    if (lastSegemnet === this.uischema.options.labelProvider[schema.id]) {
                        label.firstChild.lastChild.firstChild.textContent = newValue;
                    }
                    if (Array.isArray(newValue)) {
                        const childSchema = path_util_1.resolveSchema(schema, uischema.scope.$ref).items;
                        if (!Array.isArray(childSchema)) {
                            this.renderChildren(newValue, childSchema, label, lastSegemnet);
                        }
                    }
                }
            });
        }
        this.detail.appendChild(jsonForms);
    }
};
TreeMasterDetailRenderer = __decorate([
    renderer_util_1.JsonFormsRenderer({
        selector: 'jsonforms-tree',
        tester: testers_1.rankWith(1, testers_1.uiTypeIs('MasterDetailLayout'))
    }),
    __metadata("design:paramtypes", [])
], TreeMasterDetailRenderer);
exports.TreeMasterDetailRenderer = TreeMasterDetailRenderer;
//# sourceMappingURL=tree-renderer.js.map
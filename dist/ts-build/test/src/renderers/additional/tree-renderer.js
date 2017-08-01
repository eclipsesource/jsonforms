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
const _ = require("lodash");
const renderer_1 = require("../../core/renderer");
const renderer_util_1 = require("../renderer.util");
const path_util_1 = require("../../path.util");
const testers_1 = require("../../core/testers");
const runtime_1 = require("../../core/runtime");
const core_1 = require("../../core");
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
        const ul = document.createElement('ul');
        if (schema.items !== undefined) {
            this.expandArray(rootData, ul, schema.items);
        }
        else {
            this.expandObject(rootData, ul, schema, null);
        }
        this.master.appendChild(ul);
    }
    expandArray(data, parent, schema) {
        if (data === undefined || data === null) {
            return;
        }
        data.forEach((element, index) => {
            this.expandObject(element, parent, schema, () => data.splice(index, 1));
        });
    }
    getNamingFunction(schema) {
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
    updateTreeOnAdd(schema, li, newData, deleteFunction) {
        const subChildren = li.getElementsByTagName('ul');
        let childParent;
        if (subChildren.length !== 0) {
            childParent = subChildren.item(0);
        }
        else {
            childParent = document.createElement('ul');
            li.appendChild(childParent);
        }
        this.expandObject(newData, childParent, schema, deleteFunction);
    }
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
            spanRemove.onclick = (ev) => {
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
        core_1.JsonForms.schemaService.getContainmentProperties(schema).forEach(property => {
            const propertyData = property.getData(data);
            if (!_.isEmpty(propertyData)) {
                this.renderChildren(propertyData, property.schema, li, property.property);
            }
        });
        parent.appendChild(li);
    }
    findRendererChildContainer(li, key) {
        let ul;
        const children = li.children;
        for (let i = 0; i < children.length; i++) {
            const child = children.item(i);
            if (child.tagName === 'UL' && child.getAttribute('children') === key) {
                ul = child;
            }
        }
        return ul;
    }
    renderChildren(array, schema, li, key) {
        let ul = this.findRendererChildContainer(li, key);
        if (ul === undefined) {
            ul = document.createElement('ul');
            ul.setAttribute('children', key);
            li.appendChild(ul);
        }
        else {
            while (!_.isEmpty(ul.firstChild)) {
                ul.firstChild.remove();
            }
        }
        this.expandArray(array, ul, schema);
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
        // check needed for tests
        if (!_.isEmpty(jsonForms.addDataChangeListener)) {
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
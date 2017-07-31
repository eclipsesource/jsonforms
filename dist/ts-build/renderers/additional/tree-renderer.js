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
var _ = require("lodash");
var renderer_1 = require("../../core/renderer");
var renderer_util_1 = require("../renderer.util");
var path_util_1 = require("../../path.util");
var testers_1 = require("../../core/testers");
var runtime_1 = require("../../core/runtime");
var core_1 = require("../../core");
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
        var ul = document.createElement('ul');
        if (schema.items !== undefined) {
            this.expandArray(rootData, ul, schema.items);
        }
        else {
            this.expandObject(rootData, ul, schema, null);
        }
        this.master.appendChild(ul);
    };
    TreeMasterDetailRenderer.prototype.expandArray = function (data, parent, schema) {
        var _this = this;
        if (data === undefined || data === null) {
            return;
        }
        data.forEach(function (element, index) {
            _this.expandObject(element, parent, schema, function () { return data.splice(index, 1); });
        });
    };
    TreeMasterDetailRenderer.prototype.getNamingFunction = function (schema) {
        if (this.uischema.options !== undefined) {
            var labelProvider_1 = this.uischema.options.labelProvider;
            if (labelProvider_1 !== undefined) {
                return function (element) { return element[labelProvider_1[schema.id]]; };
            }
        }
        var namingKeys = Object.keys(schema.properties).filter(function (key) { return key === 'id' || key === 'name'; });
        if (namingKeys.length !== 0) {
            return function (element) { return element[namingKeys[0]]; };
        }
        return function (obj) { return JSON.stringify(obj); };
    };
    TreeMasterDetailRenderer.prototype.updateTreeOnAdd = function (schema, li, newData, deleteFunction) {
        var subChildren = li.getElementsByTagName('ul');
        var childParent;
        if (subChildren.length !== 0) {
            childParent = subChildren.item(0);
        }
        else {
            childParent = document.createElement('ul');
            li.appendChild(childParent);
        }
        this.expandObject(newData, childParent, schema, deleteFunction);
    };
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
                        property.addToData(data)(newData);
                        _this.updateTreeOnAdd(property.schema, li, newData, property.deleteFromData(data));
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
                deleteFunction(data);
                li.remove();
                if (_this.selected === li) {
                    _this.selectFirstElement();
                }
            };
            spanRemove.textContent = '\u274C';
            span.appendChild(spanRemove);
        }
        li.appendChild(div);
        core_1.JsonForms.schemaService.getContainmentProperties(schema).forEach(function (property) {
            var propertyData = property.getData(data);
            if (!_.isEmpty(propertyData)) {
                _this.renderChildren(propertyData, property.schema, li, property.property);
            }
        });
        parent.appendChild(li);
    };
    TreeMasterDetailRenderer.prototype.findRendererChildContainer = function (li, key) {
        var ul;
        var children = li.children;
        for (var i = 0; i < children.length; i++) {
            var child = children.item(i);
            if (child.tagName === 'UL' && child.getAttribute('children') === key) {
                ul = child;
            }
        }
        return ul;
    };
    TreeMasterDetailRenderer.prototype.renderChildren = function (array, schema, li, key) {
        var ul = this.findRendererChildContainer(li, key);
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
        // check needed for tests
        if (!_.isEmpty(jsonForms.addDataChangeListener)) {
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
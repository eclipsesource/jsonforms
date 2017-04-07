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
var renderer_1 = require("../../core/renderer");
var renderer_util_1 = require("../renderer.util");
var path_util_1 = require("../../path.util");
var TreeRenderer = (function (_super) {
    __extends(TreeRenderer, _super);
    function TreeRenderer() {
        var _this = _super.call(this) || this;
        _this.addingToRoot = false;
        return _this;
    }
    TreeRenderer.prototype.dispose = function () {
        // Do nothing
    };
    TreeRenderer.prototype.render = function () {
        var _this = this;
        var controlElement = this.uischema;
        this.resolvedSchema = path_util_1.resolveSchema(this.dataSchema, controlElement.scope.$ref);
        var div = document.createElement('div');
        div.className = 'tree-layout';
        var label = document.createElement('label');
        if (typeof controlElement.label === 'string') {
            label.textContent = controlElement.label;
        }
        this.appendChild(label);
        var rootData = this.dataService.getValue(controlElement);
        if (Array.isArray(rootData)) {
            var button = document.createElement('button');
            button.textContent = 'Add to root';
            button.onclick = function (ev) {
                var newData = {};
                _this.addingToRoot = true;
                var length = rootData.push(newData);
                _this.dataService.notifyChange(controlElement, rootData);
                _this.expandObject(newData, _this.master.firstChild, _this.dataSchema.items, function (toDelete) { return rootData.splice(length - 1, 1); });
                _this.addingToRoot = false;
            };
            this.appendChild(button);
        }
        this.master = document.createElement('div');
        this.master.className = 'tree-master';
        div.appendChild(this.master);
        this.detail = document.createElement('div');
        this.detail.className = 'tree-detail';
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
        this.dataService.registerChangeListener(this);
        return this;
    };
    TreeRenderer.prototype.isRelevantKey = function (uischema) {
        return this.uischema === uischema && !this.addingToRoot;
    };
    TreeRenderer.prototype.notifyChange = function (uischema, newValue, data) {
        this.render();
    };
    TreeRenderer.prototype.renderFull = function () {
        this.renderMaster(this.resolvedSchema);
        this.selectFirstElement();
    };
    TreeRenderer.prototype.selectFirstElement = function () {
        var controlElement = this.uischema;
        var arrayData = this.dataService.getValue(controlElement);
        if (arrayData !== undefined && arrayData.length !== 0) {
            var firstChild = arrayData;
            var schema = this.resolvedSchema;
            if (Array.isArray(firstChild)) {
                firstChild = firstChild[0];
                schema = schema.items;
            }
            this.renderDetail(firstChild, this.master.firstChild.firstChild, schema);
        }
    };
    TreeRenderer.prototype.renderMaster = function (schema) {
        if (this.master.lastChild !== null) {
            this.master.removeChild(this.master.lastChild);
        }
        var controlElement = this.uischema;
        var rootData = this.dataService.getValue(controlElement);
        if (rootData !== undefined) {
            var ul = document.createElement('ul');
            if (Array.isArray(rootData)) {
                this.expandArray(rootData, ul, schema.items);
            }
            else {
                this.expandObject(rootData, ul, schema, null);
            }
            this.master.appendChild(ul);
        }
    };
    TreeRenderer.prototype.expandArray = function (data, parent, schema) {
        var _this = this;
        data.forEach(function (element, index) {
            _this.expandObject(element, parent, schema, function (toDelete) { return data.splice(index, 1); });
        });
    };
    TreeRenderer.prototype.getArrayProperties = function (schema) {
        return Object.keys(schema.properties).filter(function (key) { return schema.properties[key].items !== undefined
            && schema.properties[key].items['type'] === 'object'; });
    };
    TreeRenderer.prototype.getNamingFunction = function (schema) {
        if (this.uischema.options === undefined) {
            return JSON.stringify;
        }
        var labelProvider = this.uischema.options['labelProvider'];
        if (labelProvider !== undefined) {
            return function (element) { return element[labelProvider[schema.id]]; };
        }
        var namingKeys = Object.keys(schema.properties).filter(function (key) { return key === 'id' || key === 'name'; });
        if (namingKeys.length !== 0) {
            return function (element) { return element[namingKeys[0]]; };
        }
        return JSON.stringify;
    };
    TreeRenderer.prototype.addElement = function (key, data, schema, li) {
        if (data[key] === undefined) {
            data[key] = [];
        }
        var childArray = data[key];
        var newData = {};
        var length = childArray.push(newData);
        var subChildren = li.getElementsByTagName('ul');
        var childParent;
        if (subChildren.length !== 0) {
            childParent = subChildren.item(0);
        }
        else {
            childParent = document.createElement('ul');
            li.appendChild(childParent);
        }
        this.expandObject(newData, childParent, schema.properties[key].items, function (toDelete) { return childArray.splice(length - 1, 1); });
    };
    ;
    TreeRenderer.prototype.expandObject = function (data, parent, schema, deleteFunction) {
        var _this = this;
        var li = document.createElement('li');
        var div = document.createElement('div');
        if (this.uischema.options !== undefined &&
            this.uischema.options['imageProvider'] !== undefined) {
            var spanIcon = document.createElement('span');
            spanIcon.classList.add('icon');
            spanIcon.classList.add(this.uischema.options['imageProvider'][schema.id]);
            div.appendChild(spanIcon);
        }
        var span = document.createElement('span');
        span.classList.add('label');
        span.onclick = function (ev) { return _this.renderDetail(data, li, schema); };
        var spanText = document.createElement('span');
        spanText.textContent = this.getNamingFunction(schema)(data);
        span.appendChild(spanText);
        div.appendChild(span);
        if (this.getArrayProperties(schema).length !== 0) {
            var spanAdd = document.createElement('span');
            spanAdd.classList.add('add');
            spanAdd.onclick = function (ev) {
                ev.stopPropagation();
                var content = _this.dialog.getElementsByClassName('content')[0];
                while (content.firstChild) {
                    content.firstChild.remove();
                }
                _this.getArrayProperties(schema).forEach(function (key) {
                    var button = document.createElement('button');
                    button.innerText = key;
                    button.onclick = function () {
                        _this.addElement(key, data, schema, li);
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
        Object.keys(data).forEach(function (key) {
            if (Array.isArray(data[key])) {
                _this.renderChildren(data[key], schema.properties[key].items, li, key);
            }
        });
        parent.appendChild(li);
    };
    TreeRenderer.prototype.findRendererChildContainer = function (li, key) {
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
    TreeRenderer.prototype.renderChildren = function (array, schema, li, key) {
        var ul = this.findRendererChildContainer(li, key);
        if (ul === undefined) {
            ul = document.createElement('ul');
            ul.setAttribute('children', key);
            li.appendChild(ul);
        }
        else {
            while (ul.firstChild) {
                ul.firstChild.remove();
            }
        }
        this.expandArray(array, ul, schema);
    };
    TreeRenderer.prototype.renderDetail = function (element, label, schema) {
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
        jsonForms.addDataChangeListener({
            isRelevantKey: function (uischema) {
                return uischema !== null;
            },
            notifyChange: function (uischema, newValue, data) {
                var segments = uischema.scope.$ref.split('/');
                var lastSegemnet = segments[segments.length - 1];
                if (lastSegemnet === _this.uischema.options['labelProvider'][schema.id]) {
                    label.firstChild.lastChild.firstChild.textContent = newValue;
                }
                if (Array.isArray(newValue)) {
                    _this.renderChildren(newValue, path_util_1.resolveSchema(schema, uischema.scope.$ref).items, label, lastSegemnet);
                }
            }
        });
        this.detail.appendChild(jsonForms);
    };
    return TreeRenderer;
}(renderer_1.Renderer));
TreeRenderer = __decorate([
    renderer_util_1.JsonFormsRenderer({
        selector: 'jsonforms-tree',
        tester: function (uischema) { return uischema.type === 'MasterDetailLayout' ? 1 : -1; }
    }),
    __metadata("design:paramtypes", [])
], TreeRenderer);
//# sourceMappingURL=tree-renderer.js.map
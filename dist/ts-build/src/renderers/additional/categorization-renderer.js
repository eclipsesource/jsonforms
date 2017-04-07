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
var CategorizationRenderer = (function (_super) {
    __extends(CategorizationRenderer, _super);
    function CategorizationRenderer() {
        return _super.call(this) || this;
    }
    CategorizationRenderer.prototype.dispose = function () {
        // Do nothing
    };
    CategorizationRenderer.prototype.render = function () {
        var controlElement = this.uischema;
        var div = document.createElement('div');
        div.className = 'jsf-categorization';
        this.master = document.createElement('div');
        this.master.className = 'jsf-categorization-master';
        div.appendChild(this.master);
        this.detail = document.createElement('div');
        this.detail.className = 'jsf-categorization-detail';
        div.appendChild(this.detail);
        this.appendChild(div);
        this.renderFull();
        return this;
    };
    CategorizationRenderer.prototype.renderFull = function () {
        this.renderMaster();
        var controlElement = this.uischema;
        var result = this.findFirstCategory(controlElement, this.master.firstChild);
        this.renderDetail(result.category, result.li);
    };
    CategorizationRenderer.prototype.findFirstCategory = function (categorization, parent) {
        var firstCategory;
        if (categorization.elements === undefined || categorization.elements.length === 0) {
            return null;
        }
        var category = categorization.elements[0];
        if (isCategorization(category)) {
            return this.findFirstCategory(category, parent.firstChild.lastChild);
        }
        return { category: category, li: parent.firstChild };
    };
    CategorizationRenderer.prototype.renderMaster = function () {
        if (this.master.lastChild !== null) {
            this.master.removeChild(this.master.lastChild);
        }
        var categorization = this.uischema;
        var ul = this.createCategorizationList(categorization);
        this.master.appendChild(ul);
    };
    CategorizationRenderer.prototype.createCategorizationList = function (categorization) {
        var _this = this;
        var ul = document.createElement('ul');
        categorization.elements.forEach(function (category) {
            var li = document.createElement('li');
            var span = document.createElement('span');
            span.textContent = category.label;
            li.appendChild(span);
            // const div = document.createElement('div');
            // div.className = 'jsf-category-entry';
            // const span = document.createElement('span');
            // span.className = 'jsf-category-label';
            // span.innerText
            if (isCategorization(category)) {
                var innerUl = _this.createCategorizationList(category);
                innerUl.className = 'jsf-category-subcategories';
                li.classList.add('jsf-category-group');
                li.appendChild(innerUl);
            }
            else {
                li.onclick = function (ev) { return _this.renderDetail(category, li); };
            }
            ul.appendChild(li);
        });
        return ul;
    };
    CategorizationRenderer.prototype.renderDetail = function (category, li) {
        var _this = this;
        if (this.detail.lastChild !== null) {
            this.detail.removeChild(this.detail.lastChild);
        }
        if (this.selected !== undefined) {
            this.selected.classList.toggle('selected');
        }
        li.classList.toggle('selected');
        this.selected = li;
        var wrapper = document.createElement('div');
        category.elements.forEach(function (child) {
            var jsonForms = document.createElement('json-forms');
            jsonForms.data = _this.dataService.getValue({ type: 'Control', scope: { $ref: '#' } });
            jsonForms.uiSchema = child;
            jsonForms.dataSchema = _this.dataSchema;
            wrapper.appendChild(jsonForms);
        });
        this.detail.appendChild(wrapper);
    };
    return CategorizationRenderer;
}(renderer_1.Renderer));
CategorizationRenderer = __decorate([
    renderer_util_1.JsonFormsRenderer({
        selector: 'jsonforms-categorization',
        tester: function (uischema) { return uischema.type === 'Categorization' ? 1 : -1; }
    }),
    __metadata("design:paramtypes", [])
], CategorizationRenderer);
function isCategorization(category) {
    return category.type === 'Categorization';
}
//# sourceMappingURL=categorization-renderer.js.map
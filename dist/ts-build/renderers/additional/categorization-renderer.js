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
var runtime_1 = require("../../core/runtime");
var testers_1 = require("../../core/testers");
var renderer_util_1 = require("../renderer.util");
var core_1 = require("../../core");
var isCategorization = function (category) {
    return category.type === 'Categorization';
};
/**
 * Default tester for a categorization.
 * @type {RankedTester}
 */
exports.categorizationTester = testers_1.rankWith(1, testers_1.and(testers_1.uiTypeIs('Categorization'), function (uiSchema) {
    var hasCategory = function (element) {
        if (_.isEmpty(element.elements)) {
            return false;
        }
        return element.elements
            .map(function (elem) { return isCategorization(elem) ?
            hasCategory(elem) :
            elem.type === 'Category'; })
            .reduce(function (prev, curr) { return prev && curr; }, true);
    };
    return hasCategory(uiSchema);
}));
/**
 * Default renderer for a categorization.
 */
var CategorizationRenderer = (function (_super) {
    __extends(CategorizationRenderer, _super);
    function CategorizationRenderer() {
        return _super.call(this) || this;
    }
    /**
     * @inheritDoc
     */
    CategorizationRenderer.prototype.dispose = function () {
        // Do nothing
    };
    /**
     * @inheritDoc
     */
    CategorizationRenderer.prototype.runtimeUpdated = function (type) {
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
    /**
     * @inheritDoc
     */
    CategorizationRenderer.prototype.render = function () {
        this.master = document.createElement('div');
        this.appendChild(this.master);
        this.detail = document.createElement('div');
        this.appendChild(this.detail);
        core_1.JsonForms.stylingRegistry
            .addStyle(this, 'categorization')
            .addStyle(this.master, 'categorization.master')
            .addStyle(this.detail, 'categorization.detail');
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
        var category = categorization.elements[0];
        if (isCategorization(category)) {
            return this.findFirstCategory(category, parent.firstChild.lastChild);
        }
        return { category: category, li: parent.firstChild };
    };
    CategorizationRenderer.prototype.renderMaster = function () {
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
                core_1.JsonForms.stylingRegistry
                    .addStyle(innerUl, 'category.subcategories')
                    .addStyle(li, 'category.group');
                li.appendChild(innerUl);
            }
            else {
                li.onclick = function (ev) {
                    _this.renderDetail(category, li);
                };
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
        if (category.elements !== undefined && category.elements !== null) {
            category.elements.forEach(function (child) {
                var jsonForms = document.createElement('json-forms');
                jsonForms.data = _this.dataService.getValue({ scope: { $ref: '#' } });
                jsonForms.uiSchema = child;
                jsonForms.dataSchema = _this.dataSchema;
                wrapper.appendChild(jsonForms);
            });
        }
        this.detail.appendChild(wrapper);
    };
    CategorizationRenderer = __decorate([
        renderer_util_1.JsonFormsRenderer({
            selector: 'jsonforms-categorization',
            tester: exports.categorizationTester
        }),
        __metadata("design:paramtypes", [])
    ], CategorizationRenderer);
    return CategorizationRenderer;
}(renderer_1.Renderer));
exports.CategorizationRenderer = CategorizationRenderer;
//# sourceMappingURL=categorization-renderer.js.map
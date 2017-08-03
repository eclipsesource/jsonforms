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
const runtime_1 = require("../../core/runtime");
const testers_1 = require("../../core/testers");
const renderer_util_1 = require("../renderer.util");
const core_1 = require("../../core");
const isCategorization = (category) => {
    return category.type === 'Categorization';
};
/**
 * Default tester for a categorization.
 * @type {RankedTester}
 */
exports.categorizationTester = testers_1.rankWith(1, testers_1.and(testers_1.uiTypeIs('Categorization'), uiSchema => {
    const hasCategory = (element) => {
        if (_.isEmpty(element.elements)) {
            return false;
        }
        return element.elements
            .map(elem => isCategorization(elem) ?
            hasCategory(elem) :
            elem.type === 'Category')
            .reduce((prev, curr) => prev && curr, true);
    };
    return hasCategory(uiSchema);
}));
/**
 * Default renderer for a categorization.
 */
let CategorizationRenderer = class CategorizationRenderer extends renderer_1.Renderer {
    constructor() {
        super();
    }
    /**
     * @inheritDoc
     */
    dispose() {
        // Do nothing
    }
    /**
     * @inheritDoc
     */
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
    /**
     * @inheritDoc
     */
    render() {
        this.className = core_1.JsonForms.stylingRegistry.getAsClassName('categorization');
        this.master = document.createElement('div');
        this.master.className = core_1.JsonForms.stylingRegistry.getAsClassName('categorization.master');
        this.appendChild(this.master);
        this.detail = document.createElement('div');
        this.detail.className = core_1.JsonForms.stylingRegistry.getAsClassName('categorization.detail');
        this.appendChild(this.detail);
        this.renderFull();
        return this;
    }
    renderFull() {
        this.renderMaster();
        const controlElement = this.uischema;
        const result = this.findFirstCategory(controlElement, this.master.firstChild);
        this.renderDetail(result.category, result.li);
    }
    findFirstCategory(categorization, parent) {
        const category = categorization.elements[0];
        if (isCategorization(category)) {
            return this.findFirstCategory(category, parent.firstChild.lastChild);
        }
        return { category: category, li: parent.firstChild };
    }
    renderMaster() {
        const categorization = this.uischema;
        const ul = this.createCategorizationList(categorization);
        this.master.appendChild(ul);
    }
    createCategorizationList(categorization) {
        const ul = document.createElement('ul');
        categorization.elements.forEach(category => {
            const li = document.createElement('li');
            const span = document.createElement('span');
            span.textContent = category.label;
            li.appendChild(span);
            // const div = document.createElement('div');
            // div.className = 'jsf-category-entry';
            // const span = document.createElement('span');
            // span.className = 'jsf-category-label';
            // span.innerText
            if (isCategorization(category)) {
                const innerUl = this.createCategorizationList(category);
                innerUl.className = core_1.JsonForms.stylingRegistry.getAsClassName('category.subcategories');
                li.className = core_1.JsonForms.stylingRegistry.getAsClassName('category.group');
                li.appendChild(innerUl);
            }
            else {
                li.onclick = (ev) => {
                    this.renderDetail(category, li);
                };
            }
            ul.appendChild(li);
        });
        return ul;
    }
    renderDetail(category, li) {
        if (this.detail.lastChild !== null) {
            this.detail.removeChild(this.detail.lastChild);
        }
        if (this.selected !== undefined) {
            this.selected.classList.toggle('selected');
        }
        li.classList.toggle('selected');
        this.selected = li;
        const wrapper = document.createElement('div');
        if (category.elements !== undefined && category.elements !== null) {
            category.elements.forEach(child => {
                const jsonForms = document.createElement('json-forms');
                jsonForms.data = this.dataService.getValue({ scope: { $ref: '#' } });
                jsonForms.uiSchema = child;
                jsonForms.dataSchema = this.dataSchema;
                wrapper.appendChild(jsonForms);
            });
        }
        this.detail.appendChild(wrapper);
    }
};
CategorizationRenderer = __decorate([
    renderer_util_1.JsonFormsRenderer({
        selector: 'jsonforms-categorization',
        tester: exports.categorizationTester
    }),
    __metadata("design:paramtypes", [])
], CategorizationRenderer);
exports.CategorizationRenderer = CategorizationRenderer;
//# sourceMappingURL=categorization-renderer.js.map
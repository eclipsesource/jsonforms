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
const core_1 = require("../../core");
const renderer_1 = require("../../core/renderer");
const testers_1 = require("../../core/testers");
const path_util_1 = require("../../path.util");
const label_util_1 = require("../label.util");
const renderer_util_1 = require("../renderer.util");
/**
 * Default tester for an array control.
 * @type {RankedTester}
 */
exports.arrayTester = testers_1.rankWith(2, testers_1.and(testers_1.uiTypeIs('Control'), testers_1.schemaMatches(schema => !_.isEmpty(schema)
    && schema.type === 'array'
    && !_.isEmpty(schema.items)
    && !Array.isArray(schema.items) // we don't care about tuples
), testers_1.schemaSubPathMatches('items', schema => schema.type === 'object')));
/**
 * Default renderer for an array.
 */
let ArrayControlRenderer = class ArrayControlRenderer extends renderer_1.Renderer {
    constructor() {
        super();
    }
    /**
     * @inheritDoc
     */
    needsNotificationAbout(controlElement) {
        return controlElement === undefined || controlElement === null
            ? false : this.uischema.scope.$ref === controlElement.scope.$ref;
    }
    /**
     * @inheritDoc
     */
    dataChanged(uischema, newValue, data) {
        this.render();
    }
    /**
     * @inheritDoc
     */
    connectedCallback() {
        super.connectedCallback();
        this.dataService.registerDataChangeListener(this);
    }
    /**
     * @inheritDoc
     */
    disconnectedCallback() {
        this.dataService.deregisterDataChangeListener(this);
        super.disconnectedCallback();
    }
    /**
     * @inheritDoc
     */
    dispose() {
        // do nothing
    }
    /**
     * @inheritDoc
     */
    render() {
        if (this.lastChild !== null) {
            this.removeChild(this.lastChild);
        }
        const controlElement = this.uischema;
        const div = document.createElement('fieldset');
        const header = document.createElement('legend');
        div.appendChild(header);
        const label = document.createElement('label');
        const labelObject = label_util_1.getElementLabelObject(this.dataSchema, controlElement);
        if (labelObject.show) {
            label.textContent = labelObject.text;
        }
        const content = document.createElement('div');
        let arrayData = this.dataService.getValue(controlElement);
        const renderChild = (element) => {
            const jsonForms = document.createElement('json-forms');
            const resolvedSchema = path_util_1.resolveSchema(this.dataSchema, controlElement.scope.$ref + '/items');
            jsonForms.data = element;
            jsonForms.dataSchema = resolvedSchema;
            content.appendChild(jsonForms);
        };
        if (arrayData !== undefined) {
            arrayData.forEach(element => {
                renderChild(element);
            });
        }
        div.appendChild(content);
        const button = document.createElement('button');
        button.textContent = `+`;
        button.onclick = (ev) => {
            if (arrayData === undefined) {
                arrayData = [];
            }
            const element = {};
            arrayData.push(element);
            renderChild(element);
            this.dataService.notifyAboutDataChange(controlElement, arrayData);
        };
        header.appendChild(button);
        header.appendChild(label);
        this.appendChild(div);
        this.classList.add(this.convertToClassName(controlElement.scope.$ref));
        core_1.JsonForms.stylingRegistry.addStyle(this, 'control')
            .addStyle(div, 'array.layout')
            .addStyle(label, 'array.label')
            .addStyle(content, 'array.children')
            .addStyle(button, 'array.button');
        return this;
    }
};
ArrayControlRenderer = __decorate([
    renderer_util_1.JsonFormsRenderer({
        selector: 'jsonforms-array',
        tester: exports.arrayTester
    }),
    __metadata("design:paramtypes", [])
], ArrayControlRenderer);
exports.ArrayControlRenderer = ArrayControlRenderer;
//# sourceMappingURL=array-renderer.js.map
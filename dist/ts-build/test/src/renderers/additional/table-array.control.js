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
const testers_1 = require("../../core/testers");
const path_util_1 = require("../../path.util");
const label_util_1 = require("../label.util");
const renderer_util_1 = require("../renderer.util");
const core_1 = require("../../core");
/**
 * Alternative tester for an array that also checks whether the 'table'
 * option is set.
 * @type {RankedTester}
 */
exports.tableArrayTester = testers_1.rankWith(10, testers_1.and(testers_1.uiTypeIs('Control'), testers_1.optionIs('table', true), testers_1.schemaMatches(schema => !_.isEmpty(schema)
    && schema.type === 'array'
    && !_.isEmpty(schema.items)
    && !Array.isArray(schema.items) // we don't care about tuples
    && schema.items.type === 'object')));
/**
 * Alternative array renderer that uses a HTML table.
 */
let TableArrayControlRenderer = class TableArrayControlRenderer extends renderer_1.Renderer {
    constructor() {
        super();
    }
    /**
     * @inheritDoc
     */
    needsNotificationAbout(uischema) {
        return uischema === undefined || uischema === null
            ? false : this.uischema.scope.$ref === uischema.scope.$ref;
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
        // no-op
    }
    /**
     * @inheritDoc
     */
    render() {
        if (this.lastChild !== null) {
            this.removeChild(this.lastChild);
        }
        const controlElement = this.uischema;
        const header = document.createElement('header');
        this.appendChild(header);
        const label = document.createElement('label');
        const labelObject = label_util_1.getElementLabelObject(this.dataSchema, controlElement);
        if (labelObject.show) {
            label.textContent = labelObject.text;
        }
        header.appendChild(label);
        const content = document.createElement('table');
        core_1.JsonForms.stylingRegistry.addStyle(this, 'array-table.table');
        const head = document.createElement('thead');
        const headRow = document.createElement('tr');
        const resolvedSchema = path_util_1.resolveSchema(this.dataSchema, controlElement.scope.$ref + '/items');
        Object.keys(resolvedSchema.properties).forEach(key => {
            if (resolvedSchema.properties[key].type === 'array') {
                return;
            }
            const headColumn = document.createElement('th');
            headColumn.innerText = key;
            headRow.appendChild(headColumn);
        });
        head.appendChild(headRow);
        content.appendChild(head);
        const body = document.createElement('tbody');
        let arrayData = this.dataService.getValue(controlElement);
        const renderChild = (element) => {
            const row = document.createElement('tr');
            Object.keys(resolvedSchema.properties).forEach(key => {
                if (resolvedSchema.properties[key].type === 'array') {
                    return;
                }
                const column = document.createElement('td');
                const newControl = {
                    type: 'Control',
                    label: false,
                    scope: { $ref: `#/properties/${key}` }
                };
                const jsonForms = document.createElement('json-forms');
                jsonForms.data = element;
                jsonForms.uiSchema = newControl;
                jsonForms.dataSchema = resolvedSchema;
                column.appendChild(jsonForms);
                row.appendChild(column);
            });
            body.appendChild(row);
        };
        content.appendChild(body);
        if (arrayData !== undefined) {
            arrayData.forEach(element => {
                renderChild(element);
            });
        }
        this.appendChild(content);
        const button = document.createElement('button');
        button.textContent = `Add to ${labelObject.text}`;
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
        core_1.JsonForms.stylingRegistry.addStyle(label, 'array-table.label')
            .addStyle(button, 'array-table.button')
            .addStyle(this, 'array-table');
        this.classList.add(this.convertToClassName(controlElement.scope.$ref));
        return this;
    }
};
TableArrayControlRenderer = __decorate([
    renderer_util_1.JsonFormsRenderer({
        selector: 'jsonforms-tablearray',
        tester: exports.tableArrayTester
    }),
    __metadata("design:paramtypes", [])
], TableArrayControlRenderer);
exports.TableArrayControlRenderer = TableArrayControlRenderer;
//# sourceMappingURL=table-array.control.js.map
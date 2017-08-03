"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const testers_1 = require("../../core/testers");
const renderer_util_1 = require("../renderer.util");
const base_control_1 = require("./base.control");
const core_1 = require("../../core");
/**
 * Default tester for boolean controls.
 * @type {RankedTester}
 */
exports.booleanControlTester = testers_1.rankWith(2, testers_1.and(testers_1.uiTypeIs('Control'), testers_1.schemaTypeIs('boolean')));
/**
 * Default boolean control.
 */
let BooleanControl = class BooleanControl extends base_control_1.BaseControl {
    render() {
        const controlElement = this.uischema;
        this.createInput(controlElement);
        this.createLabel(controlElement);
        this.label.className = core_1.JsonForms.stylingRegistry.getAsClassName('control.label');
        this.input.className = core_1.JsonForms.stylingRegistry.getAsClassName('control.input');
        this.errorElement = document.createElement('div');
        this.errorElement.className = core_1.JsonForms.stylingRegistry.getAsClassName('control.validation');
        this.appendChild(this.input);
        this.appendChild(this.label);
        this.appendChild(this.errorElement);
        this.className = core_1.JsonForms.stylingRegistry.getAsClassName('control');
        this.classList.add(this.convertToClassName(controlElement.scope.$ref));
        return this;
    }
    configureInput(input) {
        input.type = 'checkbox';
    }
    get valueProperty() {
        return 'checked';
    }
    get inputChangeProperty() {
        return 'onchange';
    }
    createInputElement() {
        return document.createElement('input');
    }
};
BooleanControl = __decorate([
    renderer_util_1.JsonFormsRenderer({
        selector: 'jsonforms-boolean',
        tester: exports.booleanControlTester
    })
], BooleanControl);
exports.BooleanControl = BooleanControl;
//# sourceMappingURL=boolean.control.js.map
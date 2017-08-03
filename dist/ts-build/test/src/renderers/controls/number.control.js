"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const testers_1 = require("../../core/testers");
const base_control_1 = require("./base.control");
const renderer_util_1 = require("../renderer.util");
/**
 * Default tester for number controls.
 * @type {RankedTester}
 */
exports.numberControlTester = testers_1.rankWith(2, testers_1.and(testers_1.uiTypeIs('Control'), testers_1.schemaTypeIs('number')));
/**
 * Default number control.
 */
let NumberControl = class NumberControl extends base_control_1.BaseControl {
    configureInput(input) {
        input.type = 'number';
        input.step = '0.1';
    }
    /**
     * @inheritDoc
     */
    get valueProperty() {
        return 'valueAsNumber';
    }
    /**
     * @inheritDoc
     */
    get inputChangeProperty() {
        return 'oninput';
    }
    /**
     * @inheritDoc
     */
    createInputElement() {
        return document.createElement('input');
    }
    /**
     * @inheritDoc
     */
    convertModelValue(value) {
        return value === undefined || value === null ? undefined : value;
    }
};
NumberControl = __decorate([
    renderer_util_1.JsonFormsRenderer({
        selector: 'jsonforms-number',
        tester: exports.numberControlTester
    })
], NumberControl);
exports.NumberControl = NumberControl;
//# sourceMappingURL=number.control.js.map
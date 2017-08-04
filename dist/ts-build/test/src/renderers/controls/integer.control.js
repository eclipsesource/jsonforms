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
/**
 * Default tester for integer controls.
 * @type {RankedTester}
 */
exports.integerControlTester = testers_1.rankWith(2, testers_1.and(testers_1.uiTypeIs('Control'), testers_1.schemaTypeIs('integer')));
/**
 * Default integer control.
 */
let IntegerControl = class IntegerControl extends base_control_1.BaseControl {
    /**
     * @inheritDoc
     */
    configureInput(input) {
        input.type = 'number';
        input.step = '1';
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
IntegerControl = __decorate([
    renderer_util_1.JsonFormsRenderer({
        selector: 'jsonforms-integer',
        tester: exports.integerControlTester
    })
], IntegerControl);
exports.IntegerControl = IntegerControl;
//# sourceMappingURL=integer.control.js.map
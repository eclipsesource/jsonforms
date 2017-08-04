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
 * Default tester for text-based/string controls.
 * @type {RankedTester}
 */
exports.textControlTester = testers_1.rankWith(1, testers_1.uiTypeIs('Control'));
/**
 * Default text-based/string control.
 */
let TextControl = class TextControl extends base_control_1.BaseControl {
    /**
     * @inheritDoc
     */
    configureInput(input) {
        input.type = 'text';
    }
    /**
     * @inheritDoc
     */
    get valueProperty() {
        return 'value';
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
    convertModelValue(value) {
        return value === undefined ? '' : value;
    }
    /**
     * @inheritDoc
     */
    createInputElement() {
        return document.createElement('input');
    }
};
TextControl = __decorate([
    renderer_util_1.JsonFormsRenderer({
        selector: 'jsonforms-text',
        tester: exports.textControlTester
    })
], TextControl);
exports.TextControl = TextControl;
//# sourceMappingURL=text.control.js.map
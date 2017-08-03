"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const testers_1 = require("../../core/testers");
const path_util_1 = require("../../path.util");
const renderer_util_1 = require("../renderer.util");
const base_control_1 = require("./base.control");
/**
 * Default tester for enum controls.
 * @type {RankedTester}
 */
exports.enumControlTester = testers_1.rankWith(2, testers_1.and(testers_1.uiTypeIs('Control'), testers_1.schemaMatches(schema => schema.hasOwnProperty('enum'))));
/**
 * Default enum control.
 */
let EnumControl = class EnumControl extends base_control_1.BaseControl {
    /**
     * @inheritDoc
     */
    configureInput(input) {
        this.options = path_util_1.resolveSchema(this.dataSchema, this.uischema.scope.$ref).enum;
        this.options.forEach(optionValue => {
            const option = document.createElement('option');
            option.value = optionValue;
            option.label = optionValue;
            input.appendChild(option);
        });
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
        return 'onchange';
    }
    /**
     * @inheritDoc
     */
    createInputElement() {
        return document.createElement('select');
    }
    /**
     * @inheritDoc
     */
    convertModelValue(value) {
        return (value === undefined || value === null) ? undefined : value;
    }
};
EnumControl = __decorate([
    renderer_util_1.JsonFormsRenderer({
        selector: 'jsonforms-enum',
        tester: exports.enumControlTester
    })
], EnumControl);
exports.EnumControl = EnumControl;
//# sourceMappingURL=enum.control.js.map
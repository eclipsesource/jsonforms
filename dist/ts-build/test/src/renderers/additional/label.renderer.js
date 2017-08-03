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
const renderer_util_1 = require("../renderer.util");
const renderer_1 = require("../../core/renderer");
const testers_1 = require("../../core/testers");
const runtime_1 = require("../../core/runtime");
const core_1 = require("../../core");
/**
 * Default tester for a label.
 * @type {RankedTester}
 */
exports.labelRendererTester = testers_1.rankWith(1, testers_1.uiTypeIs('Label'));
/**
 * Default renderer for a label.
 */
let LabelRenderer = class LabelRenderer extends renderer_1.Renderer {
    constructor() {
        super();
    }
    /**
     * @inheritDoc
     */
    render() {
        const labelElement = this.uischema;
        if (labelElement.text !== undefined && labelElement.text !== null) {
            this.textContent = labelElement.text;
        }
        this.className = core_1.JsonForms.stylingRegistry.getAsClassName('label-control');
        return this;
    }
    /**
     * @inheritDoc
     */
    dispose() {
        // Do nothing
    }
    /**
     * @inheritDoc
     * @param type
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
};
LabelRenderer = __decorate([
    renderer_util_1.JsonFormsRenderer({
        selector: 'jsonforms-label',
        tester: exports.labelRendererTester
    }),
    __metadata("design:paramtypes", [])
], LabelRenderer);
exports.LabelRenderer = LabelRenderer;
//# sourceMappingURL=label.renderer.js.map
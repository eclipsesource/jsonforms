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
const core_1 = require("../../core");
const renderer_1 = require("../../core/renderer");
const testers_1 = require("../../core/testers");
const renderer_util_1 = require("../renderer.util");
const layout_util_1 = require("./layout.util");
/**
 * Default tester for a vertical layout.
 * @type {RankedTester}
 */
exports.verticalLayoutTester = testers_1.rankWith(1, testers_1.uiTypeIs('VerticalLayout'));
/**
 * Default renderer for a vertical layout.
 */
let VerticalLayoutRenderer = class VerticalLayoutRenderer extends renderer_1.Renderer {
    constructor() {
        super();
    }
    /**
     * @inheritDoc
     */
    render() {
        const div = document.createElement('div');
        div.className = 'vertical-layout';
        const verticalLayout = this.uischema;
        if (verticalLayout.elements !== undefined && verticalLayout.elements !== null) {
            verticalLayout.elements.forEach(element => {
                const bestRenderer = core_1.JsonForms.rendererService
                    .findMostApplicableRenderer(element, this.dataSchema, this.dataService);
                div.appendChild(bestRenderer);
            });
        }
        this.appendChild(div);
        this.evaluateRuntimeNotification = layout_util_1.createRuntimeNotificationEvaluator(this, this.uischema);
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
     */
    runtimeUpdated(type) {
        this.evaluateRuntimeNotification(type);
    }
};
VerticalLayoutRenderer = __decorate([
    renderer_util_1.JsonFormsRenderer({
        selector: 'jsonforms-verticallayout',
        tester: exports.verticalLayoutTester
    }),
    __metadata("design:paramtypes", [])
], VerticalLayoutRenderer);
exports.VerticalLayoutRenderer = VerticalLayoutRenderer;
//# sourceMappingURL=vertical.layout.js.map
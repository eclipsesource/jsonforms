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
 * Default tester for a group layout.
 *
 * @type {RankedTester}
 */
exports.groupTester = testers_1.rankWith(1, testers_1.uiTypeIs('Group'));
/**
 * Default renderer for a group layout.
 */
let GroupLayoutRenderer = class GroupLayoutRenderer extends renderer_1.Renderer {
    constructor() {
        super();
    }
    /**
     * @inheritDoc
     */
    render() {
        const group = this.uischema;
        const fieldset = document.createElement('fieldset');
        fieldset.className = core_1.JsonForms.stylingRegistry.getAsClassName('group-layout');
        if (group.label !== undefined) {
            const legend = document.createElement('legend');
            legend.innerText = group.label;
            fieldset.appendChild(legend);
        }
        if (group.elements !== undefined && group.elements !== null) {
            group.elements.forEach(element => {
                const bestRenderer = core_1.JsonForms.rendererService
                    .findMostApplicableRenderer(element, this.dataSchema, this.dataService);
                fieldset.appendChild(bestRenderer);
            });
        }
        this.appendChild(fieldset);
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
GroupLayoutRenderer = __decorate([
    renderer_util_1.JsonFormsRenderer({
        selector: 'jsonforms-grouplayout',
        tester: exports.groupTester
    }),
    __metadata("design:paramtypes", [])
], GroupLayoutRenderer);
exports.GroupLayoutRenderer = GroupLayoutRenderer;
//# sourceMappingURL=group.layout.js.map
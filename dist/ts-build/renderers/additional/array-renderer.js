"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var _ = require("lodash");
var core_1 = require("../../core");
var renderer_1 = require("../../core/renderer");
var testers_1 = require("../../core/testers");
var path_util_1 = require("../../path.util");
var label_util_1 = require("../label.util");
var renderer_util_1 = require("../renderer.util");
/**
 * Default tester for an array control.
 * @type {RankedTester}
 */
exports.arrayTester = testers_1.rankWith(2, testers_1.and(testers_1.uiTypeIs('Control'), testers_1.schemaMatches(function (schema) {
    return !_.isEmpty(schema)
        && schema.type === 'array'
        && !_.isEmpty(schema.items)
        && !Array.isArray(schema.items);
} // we don't care about tuples
), testers_1.schemaSubPathMatches('items', function (schema) {
    return schema.type === 'object';
})));
/**
 * Default renderer for an array.
 */
var ArrayControlRenderer = (function (_super) {
    __extends(ArrayControlRenderer, _super);
    function ArrayControlRenderer() {
        return _super.call(this) || this;
    }
    /**
     * @inheritDoc
     */
    ArrayControlRenderer.prototype.needsNotificationAbout = function (controlElement) {
        return controlElement === undefined || controlElement === null
            ? false : this.uischema.scope.$ref === controlElement.scope.$ref;
    };
    /**
     * @inheritDoc
     */
    ArrayControlRenderer.prototype.dataChanged = function (uischema, newValue, data) {
        this.render();
    };
    /**
     * @inheritDoc
     */
    ArrayControlRenderer.prototype.connectedCallback = function () {
        _super.prototype.connectedCallback.call(this);
        this.dataService.registerDataChangeListener(this);
    };
    /**
     * @inheritDoc
     */
    ArrayControlRenderer.prototype.disconnectedCallback = function () {
        this.dataService.deregisterDataChangeListener(this);
        _super.prototype.disconnectedCallback.call(this);
    };
    /**
     * @inheritDoc
     */
    ArrayControlRenderer.prototype.dispose = function () {
        // do nothing
    };
    /**
     * @inheritDoc
     */
    ArrayControlRenderer.prototype.render = function () {
        var _this = this;
        this.classList.add('control');
        if (this.lastChild !== null) {
            this.removeChild(this.lastChild);
        }
        var controlElement = this.uischema;
        var div = document.createElement('fieldset');
        div.className = 'array-layout';
        var header = document.createElement('legend');
        div.appendChild(header);
        var label = document.createElement('label');
        var labelObject = label_util_1.getElementLabelObject(this.dataSchema, controlElement);
        if (labelObject.show) {
            label.textContent = labelObject.text;
        }
        header.appendChild(label);
        var content = document.createElement('div');
        content.classList.add('children');
        var arrayData = this.dataService.getValue(controlElement);
        var renderChild = function (element) {
            var jsonForms = document.createElement('json-forms');
            var resolvedSchema = path_util_1.resolveSchema(_this.dataSchema, controlElement.scope.$ref + '/items');
            jsonForms.data = element;
            jsonForms.dataSchema = resolvedSchema;
            content.appendChild(jsonForms);
        };
        if (arrayData !== undefined) {
            arrayData.forEach(function (element) {
                renderChild(element);
            });
        }
        div.appendChild(content);
        var button = document.createElement('button');
        button.className = core_1.JsonForms.stylingRegistry.getAsClassName('button');
        button.textContent = "Add to " + labelObject.text;
        button.onclick = function (ev) {
            if (arrayData === undefined) {
                arrayData = [];
            }
            var element = {};
            arrayData.push(element);
            renderChild(element);
            _this.dataService.notifyAboutDataChange(controlElement, arrayData);
        };
        header.appendChild(button);
        this.appendChild(div);
        this.classList.add(this.convertToClassName(controlElement.scope.$ref));
        return this;
    };
    ArrayControlRenderer = __decorate([
        renderer_util_1.JsonFormsRenderer({
            selector: 'jsonforms-array',
            tester: exports.arrayTester
        }),
        __metadata("design:paramtypes", [])
    ], ArrayControlRenderer);
    return ArrayControlRenderer;
}(renderer_1.Renderer));
exports.ArrayControlRenderer = ArrayControlRenderer;
//# sourceMappingURL=array-renderer.js.map
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
var renderer_1 = require("../../core/renderer");
var renderer_util_1 = require("../renderer.util");
var path_util_1 = require("../../path.util");
var label_util_1 = require("../label.util");
exports.ArrayControlTester = function (uischema, schema) {
    if (uischema.type !== 'Control') {
        return -1;
    }
    var subSchema = path_util_1.resolveSchema(schema, uischema.scope.$ref);
    if (subSchema === undefined) {
        return -1;
    }
    if (subSchema.type !== 'array') {
        return -1;
    }
    if (subSchema.items === undefined) {
        return -1;
    }
    if (Array.isArray(subSchema.items)) {
        return -1;
    }
    return subSchema.items.type === 'object' ? 2 : -1;
};
var ArrayControlRenderer = (function (_super) {
    __extends(ArrayControlRenderer, _super);
    function ArrayControlRenderer() {
        return _super.call(this) || this;
    }
    ArrayControlRenderer.prototype.isRelevantKey = function (uischema) {
        return uischema === undefined || uischema === null
            ? false : this.uischema.scope.$ref === uischema.scope.$ref;
    };
    ArrayControlRenderer.prototype.notifyChange = function (uischema, newValue, data) {
        this.render();
    };
    ArrayControlRenderer.prototype.connectedCallback = function () {
        _super.prototype.connectedCallback.call(this);
        this.dataService.registerChangeListener(this);
    };
    ArrayControlRenderer.prototype.disconnectedCallback = function () {
        this.dataService.unregisterChangeListener(this);
        _super.prototype.disconnectedCallback.call(this);
    };
    ArrayControlRenderer.prototype.dispose = function () {
        // do nothing
    };
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
            arrayData.forEach(function (element) { return renderChild(element); });
        }
        div.appendChild(content);
        var button = document.createElement('button');
        button.textContent = "Add to " + labelObject.text;
        button.onclick = function (ev) {
            if (arrayData === undefined) {
                arrayData = [];
            }
            var element = {};
            arrayData.push(element);
            renderChild(element);
            _this.dataService.notifyChange(controlElement, arrayData);
        };
        header.appendChild(button);
        this.appendChild(div);
        return this;
    };
    return ArrayControlRenderer;
}(renderer_1.Renderer));
ArrayControlRenderer = __decorate([
    renderer_util_1.JsonFormsRenderer({
        selector: 'jsonforms-array',
        tester: exports.ArrayControlTester
    }),
    __metadata("design:paramtypes", [])
], ArrayControlRenderer);
exports.ArrayControlRenderer = ArrayControlRenderer;
//# sourceMappingURL=array-renderer.js.map
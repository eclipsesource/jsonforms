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
var TableArrayControlRenderer = (function (_super) {
    __extends(TableArrayControlRenderer, _super);
    function TableArrayControlRenderer() {
        return _super.call(this) || this;
    }
    TableArrayControlRenderer.prototype.isRelevantKey = function (uischema) {
        return uischema === undefined || uischema === null
            ? false : this.uischema.scope.$ref === uischema.scope.$ref;
    };
    TableArrayControlRenderer.prototype.notifyChange = function (uischema, newValue, data) {
        this.render();
    };
    TableArrayControlRenderer.prototype.connectedCallback = function () {
        _super.prototype.connectedCallback.call(this);
        this.dataService.registerChangeListener(this);
    };
    TableArrayControlRenderer.prototype.disconnectedCallback = function () {
        this.dataService.unregisterChangeListener(this);
        _super.prototype.disconnectedCallback.call(this);
    };
    TableArrayControlRenderer.prototype.dispose = function () {
    };
    TableArrayControlRenderer.prototype.render = function () {
        var _this = this;
        if (this.lastChild !== null) {
            this.removeChild(this.lastChild);
        }
        var controlElement = this.uischema;
        var div = document.createElement('div');
        div.classList.add('array-table-layout');
        div.classList.add('control');
        var header = document.createElement('header');
        div.appendChild(header);
        var label = document.createElement('label');
        var labelObject = label_util_1.getElementLabelObject(this.dataSchema, controlElement);
        if (labelObject.show) {
            label.textContent = labelObject.text;
        }
        header.appendChild(label);
        var content = document.createElement('table');
        var head = document.createElement('thead');
        var headRow = document.createElement('tr');
        var resolvedSchema = path_util_1.resolveSchema(this.dataSchema, controlElement.scope.$ref + '/items');
        Object.keys(resolvedSchema.properties).forEach(function (key) {
            if (resolvedSchema.properties[key].type === 'array') {
                return;
            }
            var headColumn = document.createElement('th');
            headColumn.innerText = key;
            headRow.appendChild(headColumn);
        });
        head.appendChild(headRow);
        content.appendChild(head);
        var body = document.createElement('tbody');
        var arrayData = this.dataService.getValue(controlElement);
        var renderChild = function (element) {
            var row = document.createElement('tr');
            Object.keys(resolvedSchema.properties).forEach(function (key) {
                if (resolvedSchema.properties[key].type === 'array') {
                    return;
                }
                var column = document.createElement('td');
                var jsonForms = document.createElement('json-forms');
                jsonForms.data = element;
                jsonForms.uiSchema = {
                    type: 'Control',
                    label: false,
                    scope: { $ref: "#/properties/" + key }
                };
                jsonForms.dataSchema = resolvedSchema;
                column.appendChild(jsonForms);
                row.appendChild(column);
            });
            body.appendChild(row);
        };
        content.appendChild(body);
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
    return TableArrayControlRenderer;
}(renderer_1.Renderer));
TableArrayControlRenderer = __decorate([
    renderer_util_1.JsonFormsRenderer({
        selector: 'jsonforms-tablearray',
        tester: function (uischema, schema) {
            if (uischema.type !== 'Control' || uischema.options === undefined
                || !uischema.options['table']) {
                return -1;
            }
            var subSchema = path_util_1.resolveSchema(schema, uischema.scope.$ref);
            if (subSchema === undefined) {
                return -1;
            }
            return subSchema.type === 'array' ? 10 : -1;
        }
    }),
    __metadata("design:paramtypes", [])
], TableArrayControlRenderer);
exports.TableArrayControlRenderer = TableArrayControlRenderer;
//# sourceMappingURL=table-array.control.js.map
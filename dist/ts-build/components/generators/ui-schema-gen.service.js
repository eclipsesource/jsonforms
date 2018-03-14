"use strict";
var pathutil_1 = require('../services/pathutil');
var UISchemaGenerator = (function () {
    function UISchemaGenerator() {
        this.addLabel = function (layout, labelName) {
            if (labelName && labelName !== '') {
                var label = {
                    type: 'Label',
                    text: pathutil_1.PathUtil.beautify(labelName)
                };
                layout.elements.push(label);
            }
        };
    }
    UISchemaGenerator.createLayout = function (layoutType) {
        return {
            type: layoutType,
            elements: []
        };
    };
    UISchemaGenerator.isIgnoredProperty = function (propertyKey, propertyValue) {
        return propertyKey === 'id' && typeof propertyValue === 'string';
    };
    UISchemaGenerator.deriveType = function (jsonSchema) {
        if (jsonSchema.type) {
            return jsonSchema.type;
        }
        if (jsonSchema.properties || jsonSchema.additionalProperties) {
            return 'object';
        }
        return 'null';
    };
    UISchemaGenerator.getControlObject = function (label, ref) {
        var control = {
            type: 'Control',
            scope: {
                $ref: ref
            }
        };
        if (label) {
            control.label = label;
        }
        return control;
    };
    UISchemaGenerator.wrapInLayoutIfNecessary = function (uiSchema, layoutType) {
        if (uiSchema['elements'] === undefined) {
            var verticalLayout = UISchemaGenerator.createLayout(layoutType);
            verticalLayout.elements.push(uiSchema);
            return verticalLayout;
        }
        return uiSchema;
    };
    UISchemaGenerator.prototype.generateDefaultUISchema = function (jsonSchema, layoutType) {
        if (layoutType === void 0) { layoutType = 'VerticalLayout'; }
        var uiSchema = this.generateUISchema(jsonSchema, [], '#', '', layoutType);
        return UISchemaGenerator.wrapInLayoutIfNecessary(uiSchema, layoutType);
    };
    ;
    UISchemaGenerator.prototype.generateUISchema = function (jsonSchema, schemaElements, currentRef, schemaName, layoutType) {
        var _this = this;
        var type = UISchemaGenerator.deriveType(jsonSchema);
        switch (type) {
            case 'object':
                var layout_1 = UISchemaGenerator.createLayout(layoutType);
                schemaElements.push(layout_1);
                this.addLabel(layout_1, schemaName);
                if (jsonSchema.properties) {
                    var nextRef_1 = currentRef + '/properties';
                    _.forOwn(jsonSchema.properties, function (value, key) {
                        if (!UISchemaGenerator.isIgnoredProperty(key, value)) {
                            _this.generateUISchema(value, layout_1.elements, nextRef_1 + "/" + key, key, layoutType);
                        }
                    });
                }
                return layout_1;
            case 'array':
            case 'string':
            case 'number':
            case 'integer':
            case 'boolean':
                var controlObject = UISchemaGenerator.getControlObject(pathutil_1.PathUtil.beautify(schemaName), currentRef);
                schemaElements.push(controlObject);
                return controlObject;
            case 'null':
                return null;
            default:
                throw new Error('Unknown type: ' + JSON.stringify(jsonSchema));
        }
    };
    ;
    return UISchemaGenerator;
}());
exports.UISchemaGenerator = UISchemaGenerator;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = angular
    .module('jsonforms.generators.uischema', ['jsonforms.generators'])
    .service('UISchemaGenerator', UISchemaGenerator).name;
//# sourceMappingURL=ui-schema-gen.service.js.map
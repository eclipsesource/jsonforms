"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var path_util_1 = require("../path.util");
var LabelObject = (function () {
    function LabelObject(text, show) {
        this.text = text;
        this.show = show;
    }
    return LabelObject;
}());
var deriveLabel = function (controlElement) {
    var ref = controlElement.scope.$ref;
    var label = ref.substr(ref.lastIndexOf('/') + 1);
    return _.startCase(label);
};
var getLabelObject = function (withLabel) {
    var labelProperty = withLabel.label;
    var derivedLabel = deriveLabel(withLabel);
    if (typeof labelProperty === 'boolean') {
        if (labelProperty) {
            return new LabelObject(derivedLabel, labelProperty);
        }
        else {
            return new LabelObject(derivedLabel, labelProperty);
        }
    }
    else if (typeof labelProperty === 'string') {
        return new LabelObject(labelProperty, true);
    }
    else if (typeof labelProperty === 'object') {
        var show = labelProperty.hasOwnProperty('show') ? labelProperty.show : true;
        var label = labelProperty.hasOwnProperty('text') ?
            labelProperty.text : derivedLabel;
        return new LabelObject(label, show);
    }
    else {
        return new LabelObject(derivedLabel, true);
    }
};
var isRequired = function (schema, schemaPath) {
    var pathSegments = schemaPath.split('/');
    var lastSegment = pathSegments[pathSegments.length - 1];
    var nextHigherSchemaSegments = pathSegments.slice(0, pathSegments.length - 2);
    var nextHigherSchemaPath = nextHigherSchemaSegments.join('/');
    var nextHigherSchema = path_util_1.resolveSchema(schema, nextHigherSchemaPath);
    if (nextHigherSchema !== undefined && nextHigherSchema.required !== undefined &&
        nextHigherSchema.required.indexOf(lastSegment) !== -1) {
        return true;
    }
    return false;
};
/**
 * Return a label object based on the given JSON schema and control element.
 * @param {JsonSchema} schema the JSON schema that the given control element is referring to
 * @param {ControlElement} controlElement the UI schema to obtain a label object for
 * @returns {ILabelObject}
 */
exports.getElementLabelObject = function (schema, controlElement) {
    var labelObject = getLabelObject(controlElement);
    if (isRequired(schema, controlElement.scope.$ref)) {
        labelObject.text += '*';
    }
    return labelObject;
};
//# sourceMappingURL=label.util.js.map
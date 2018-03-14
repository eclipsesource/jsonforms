"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var LabelObject = /** @class */ (function () {
    function LabelObject(text, show) {
        this.text = text;
        this.show = show;
    }
    return LabelObject;
}());
var deriveLabel = function (controlElement) {
    if (controlElement.scope !== undefined) {
        var ref = controlElement.scope.$ref;
        var label = ref.substr(ref.lastIndexOf('/') + 1);
        return _.startCase(label);
    }
    return '';
};
/**
 * Return a label object based on the given control element.
 * @param {ControlElement} withLabel the UI schema to obtain a label object for
 * @returns {ILabelObject}
 */
exports.getLabelObject = function (withLabel) {
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
//# sourceMappingURL=label.util.js.map
"use strict";
var pathutil_1 = require('../services/pathutil');
var Labels = (function () {
    function Labels() {
    }
    Labels.prototype.shouldShowLabel = function (withLabel) {
        var label = withLabel.label;
        if (label === undefined) {
            return true;
        }
        else if (_.isBoolean(label)) {
            return label;
        }
        else if (_.isString(label)) {
            return label !== '';
        }
        else {
            var labelObj = label;
            return _.has(labelObj, 'show') ? labelObj.show : true;
        }
    };
    Labels.prototype.getElementLabelObject = function (withLabel, schemaPath) {
        var labelProperty = withLabel.label;
        if (_.isBoolean(labelProperty)) {
            if (labelProperty) {
                return new LabelObject(pathutil_1.PathUtil.beautifiedLastFragment(schemaPath), labelProperty);
            }
            else {
                return new LabelObject(undefined, labelProperty);
            }
        }
        else if (_.isString(labelProperty)) {
            return new LabelObject(labelProperty, true);
        }
        else if (_.isObject(labelProperty)) {
            var show = _.has(labelProperty, 'show') ?
                labelProperty.show : true;
            var label = _.has(labelProperty, 'text') ?
                labelProperty.text : pathutil_1.PathUtil.beautifiedLastFragment(schemaPath);
            return new LabelObject(label, show);
        }
        else {
            return new LabelObject(pathutil_1.PathUtil.beautifiedLastFragment(schemaPath), true);
        }
    };
    return Labels;
}());
exports.Labels = Labels;
exports.LabelObjectUtil = new Labels();
var LabelObject = (function () {
    function LabelObject(text, show) {
        this.text = text;
        this.show = show;
    }
    return LabelObject;
}());
//# sourceMappingURL=Labels.js.map
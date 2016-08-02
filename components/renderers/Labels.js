var pathutil_1 = require("../services/pathutil");
var LabelObjectUtil = (function () {
    function LabelObjectUtil() {
    }
    LabelObjectUtil.shouldShowLabel = function (label) {
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
            return labelObj.hasOwnProperty('show') ? labelObj.show : true;
        }
    };
    LabelObjectUtil.getElementLabelObject = function (labelProperty, schemaPath) {
        if (typeof labelProperty === 'boolean') {
            if (labelProperty) {
                return new LabelObject(pathutil_1.PathUtil.beautifiedLastFragment(schemaPath), labelProperty);
            }
            else {
                return new LabelObject(undefined, labelProperty);
            }
        }
        else if (typeof labelProperty === 'string') {
            return new LabelObject(labelProperty, true);
        }
        else if (typeof labelProperty === 'object') {
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
    return LabelObjectUtil;
})();
exports.LabelObjectUtil = LabelObjectUtil;
var LabelObject = (function () {
    function LabelObject(text, show) {
        this.text = text;
        this.show = show;
    }
    return LabelObject;
})();
//# sourceMappingURL=Labels.js.map
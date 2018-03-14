"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var JSX_1 = require("../JSX");
var _ = require("lodash");
var renderer_1 = require("../../core/renderer");
var testers_1 = require("../../core/testers");
var path_util_1 = require("../../path.util");
var label_util_1 = require("../label.util");
var core_1 = require("../../core");
var ui_schema_gen_1 = require("../../generators/ui-schema-gen");
var actions_1 = require("../../actions");
var index_1 = require("../../reducers/index");
var dispatch_renderer_1 = require("../dispatch-renderer");
var renderer_util_1 = require("../renderer.util");
var binding_1 = require("../../common/binding");
exports.getStyle = function (styleName) {
    return core_1.JsonForms.stylingRegistry.getAsClassName(styleName);
};
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
var addNewItem = function (dispatch, path) {
    var element = {};
    dispatch(actions_1.update(path, function (array) {
        if (array === undefined || array === null) {
            return [element];
        }
        var clone = _.clone(array);
        clone.push(element);
        return clone;
    }));
};
exports.ArrayControlRenderer = function (_a) {
    var schema = _a.schema, uischema = _a.uischema, data = _a.data, path = _a.path, dispatch = _a.dispatch;
    var controlElement = uischema;
    var label = label_util_1.getLabelObject(controlElement);
    var resolvedSchema = path_util_1.resolveSchema(schema, controlElement.scope.$ref + '/items');
    var className = "control " + (renderer_1.convertToClassName(controlElement.scope.$ref));
    return (JSX_1.JSX.createElement("div", { className: className },
        JSX_1.JSX.createElement("fieldset", { className: exports.getStyle('array.layout') },
            JSX_1.JSX.createElement("legend", null,
                JSX_1.JSX.createElement("button", { className: exports.getStyle('array.button'), onClick: function () { return addNewItem(dispatch, path); } }, "+"),
                JSX_1.JSX.createElement("label", { className: 'array.label' }, label.show ? label.text : '')),
            JSX_1.JSX.createElement("div", { className: core_1.JsonForms.stylingRegistry.getAsClassName('array.children') }, data ? data.map(function (child, index) {
                var generatedUi = ui_schema_gen_1.generateDefaultUISchema(resolvedSchema, 'HorizontalLayout');
                var childPath = path_util_1.compose(path, index + '');
                return (JSX_1.JSX.createElement(dispatch_renderer_1.default, { schema: resolvedSchema, uischema: generatedUi, path: childPath, key: childPath }));
            }) : JSX_1.JSX.createElement("p", null, "No data")))));
};
var mapStateToProps = function (state, ownProps) {
    var path = path_util_1.composeWithUi(ownProps.uischema, ownProps.path);
    return {
        data: path_util_1.resolveData(index_1.getData(state), path),
        uischema: ownProps.uischema,
        schema: ownProps.schema,
        path: path
    };
};
exports.default = renderer_util_1.registerStartupRenderer(exports.arrayTester, binding_1.connect(mapStateToProps)(exports.ArrayControlRenderer));
//# sourceMappingURL=array-renderer.js.map
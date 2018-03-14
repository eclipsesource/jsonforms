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
Object.defineProperty(exports, "__esModule", { value: true });
var JSX_1 = require("../JSX");
var _ = require("lodash");
var core_1 = require("../../core");
var renderer_1 = require("../../core/renderer");
var testers_1 = require("../../core/testers");
var label_util_1 = require("../label.util");
var path_util_1 = require("../../path.util");
var actions_1 = require("../../actions");
var index_1 = require("../../reducers/index");
var dispatch_renderer_1 = require("../dispatch-renderer");
var renderer_util_1 = require("../renderer.util");
var binding_1 = require("../../common/binding");
/**
 * Alternative tester for an array that also checks whether the 'table'
 * option is set.
 * @type {RankedTester}
 */
exports.tableArrayTester = testers_1.rankWith(10, testers_1.and(testers_1.uiTypeIs('Control'), testers_1.optionIs('table', true), testers_1.schemaMatches(function (schema) {
    return !_.isEmpty(schema)
        && schema.type === 'array'
        && !_.isEmpty(schema.items)
        && !Array.isArray(schema.items) // we don't care about tuples
        && schema.items.type === 'object';
})));
var TableArrayControl = /** @class */ (function (_super) {
    __extends(TableArrayControl, _super);
    function TableArrayControl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // TODO duplicate code
    TableArrayControl.prototype.addNewItem = function (path) {
        var element = {};
        this.props.dispatch(actions_1.update(path, function (array) {
            if (array === undefined || array === null) {
                return [element];
            }
            var clone = _.clone(array);
            clone.push(element);
            return clone;
        }));
    };
    /**
     * @inheritDoc
     */
    TableArrayControl.prototype.render = function () {
        var _this = this;
        var _a = this.props, uischema = _a.uischema, schema = _a.schema, path = _a.path, data = _a.data;
        var controlElement = uischema;
        var tableClasses = [
            core_1.JsonForms.stylingRegistry.getAsClassName('array-table.table'),
            "control " + renderer_1.convertToClassName(controlElement.scope.$ref)
        ];
        var labelClass = core_1.JsonForms.stylingRegistry.getAsClassName('array-table.label');
        var buttonClass = core_1.JsonForms.stylingRegistry.getAsClassName('array-table.button');
        var headerClass = core_1.JsonForms.stylingRegistry.getAsClassName('array-table')
            .concat(renderer_1.convertToClassName(controlElement.scope.$ref));
        var labelObject = label_util_1.getLabelObject(controlElement);
        var resolvedSchema = path_util_1.resolveSchema(schema, controlElement.scope.$ref + '/items');
        var createControlElement = function (key) { return ({
            type: 'Control',
            label: false,
            scope: { $ref: "#/properties/" + key }
        }); };
        return (JSX_1.JSX.createElement("div", { className: tableClasses.join(' ') },
            JSX_1.JSX.createElement("header", { className: headerClass },
                JSX_1.JSX.createElement("label", { className: labelClass }, labelObject.show && labelObject.text),
                JSX_1.JSX.createElement("button", { className: buttonClass, onClick: function () { return _this.addNewItem(path); } },
                    "Add to ",
                    labelObject.text)),
            JSX_1.JSX.createElement("table", null,
                JSX_1.JSX.createElement("thead", null,
                    JSX_1.JSX.createElement("tr", null, _(resolvedSchema.properties)
                        .keys()
                        .filter(function (prop) { return resolvedSchema.properties[prop].type !== 'array'; })
                        .map(function (prop) { return JSX_1.JSX.createElement("th", { key: prop }, prop); })
                        .value())),
                JSX_1.JSX.createElement("tbody", null, data ? data.map(function (child, index) {
                    var childPath = path_util_1.compose(path, index + '');
                    return (JSX_1.JSX.createElement("tr", { key: childPath }, _.chain(resolvedSchema.properties)
                        .keys()
                        .filter(function (prop) { return resolvedSchema.properties[prop].type !== 'array'; })
                        .map(function (prop, idx) {
                        return (JSX_1.JSX.createElement("td", { key: path_util_1.compose(childPath, idx.toString()) },
                            JSX_1.JSX.createElement(dispatch_renderer_1.default, { schema: resolvedSchema, uischema: createControlElement(prop), path: childPath })));
                    })
                        .value()));
                }) : JSX_1.JSX.createElement("p", null, "No data")))));
    };
    return TableArrayControl;
}(renderer_1.Renderer));
exports.TableArrayControl = TableArrayControl;
var mapStateToProps = function (state, ownProps) {
    var path = path_util_1.composeWithUi(ownProps.uischema, ownProps.path);
    return {
        data: path_util_1.resolveData(index_1.getData(state), path),
        uischema: ownProps.uischema,
        schema: ownProps.schema,
        path: path
    };
};
exports.default = renderer_util_1.registerStartupRenderer(exports.tableArrayTester, binding_1.connect(mapStateToProps)(TableArrayControl));
//# sourceMappingURL=table-array.control.js.map
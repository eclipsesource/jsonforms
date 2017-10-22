"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const JSX_1 = require("../JSX");
const _ = require("lodash");
const inferno_redux_1 = require("inferno-redux");
const core_1 = require("../../core");
const renderer_1 = require("../../core/renderer");
const testers_1 = require("../../core/testers");
const label_util_1 = require("../label.util");
const path_util_1 = require("../../path.util");
const actions_1 = require("../../actions");
const index_1 = require("../../reducers/index");
const dispatch_renderer_1 = require("../dispatch-renderer");
const renderer_util_1 = require("../renderer.util");
/**
 * Alternative tester for an array that also checks whether the 'table'
 * option is set.
 * @type {RankedTester}
 */
exports.tableArrayTester = testers_1.rankWith(10, testers_1.and(testers_1.uiTypeIs('Control'), testers_1.optionIs('table', true), testers_1.schemaMatches(schema => !_.isEmpty(schema)
    && schema.type === 'array'
    && !_.isEmpty(schema.items)
    && !Array.isArray(schema.items) // we don't care about tuples
    && schema.items.type === 'object')));
class TableArrayControl extends renderer_1.Renderer {
    // TODO duplicate code
    addNewItem(path) {
        const element = {};
        this.props.dispatch(actions_1.update(path, array => {
            if (array === undefined || array === null) {
                return [element];
            }
            const clone = _.clone(array);
            clone.push(element);
            return clone;
        }));
    }
    /**
     * @inheritDoc
     */
    render() {
        const { uischema, schema, path, data } = this.props;
        const controlElement = uischema;
        const tableClasses = [
            core_1.JsonForms.stylingRegistry.getAsClassName('array-table.table'),
            `control ${renderer_1.convertToClassName(controlElement.scope.$ref)}`
        ];
        const labelClass = core_1.JsonForms.stylingRegistry.getAsClassName('array-table.label');
        const buttonClass = core_1.JsonForms.stylingRegistry.getAsClassName('array-table.button');
        const headerClass = core_1.JsonForms.stylingRegistry.getAsClassName('array-table')
            .concat(renderer_1.convertToClassName(controlElement.scope.$ref));
        const labelObject = label_util_1.getElementLabelObject(schema, controlElement);
        const resolvedSchema = path_util_1.resolveSchema(schema, controlElement.scope.$ref + '/items');
        const createControlElement = (key) => ({
            type: 'Control',
            label: false,
            scope: { $ref: `#/properties/${key}` }
        });
        return (JSX_1.JSX.createElement("div", { className: tableClasses },
            JSX_1.JSX.createElement("header", { className: headerClass },
                JSX_1.JSX.createElement("label", { className: labelClass }, labelObject.show && labelObject.text),
                JSX_1.JSX.createElement("button", { className: buttonClass, onclick: () => this.addNewItem(path) },
                    "Add to ",
                    labelObject.text)),
            JSX_1.JSX.createElement("table", null,
                JSX_1.JSX.createElement("thead", null,
                    JSX_1.JSX.createElement("tr", null, _(resolvedSchema.properties)
                        .keys()
                        .filter(prop => resolvedSchema.properties[prop].type !== 'array')
                        .map(prop => JSX_1.JSX.createElement("th", null, prop))
                        .value())),
                JSX_1.JSX.createElement("tbody", null, data ? data.map((child, index) => {
                    return (JSX_1.JSX.createElement("tr", null, _.chain(resolvedSchema.properties)
                        .keys()
                        .filter(prop => resolvedSchema.properties[prop].type !== 'array')
                        .map(prop => {
                        const childPath = path_util_1.compose(path, index + '');
                        return (JSX_1.JSX.createElement("td", null,
                            JSX_1.JSX.createElement(dispatch_renderer_1.default, { schema: resolvedSchema, uischema: createControlElement(prop), path: childPath })));
                    })
                        .value()));
                }) : JSX_1.JSX.createElement("p", null, "No data")))));
    }
}
exports.TableArrayControl = TableArrayControl;
const mapStateToProps = (state, ownProps) => {
    const path = path_util_1.composeWithUi(ownProps.uischema, ownProps.path);
    return {
        data: path_util_1.resolveData(index_1.getData(state), path),
        uischema: ownProps.uischema,
        schema: ownProps.schema,
        path
    };
};
exports.default = renderer_util_1.registerStartupRenderer(exports.tableArrayTester, inferno_redux_1.connect(mapStateToProps)(TableArrayControl));
//# sourceMappingURL=table-array.control.js.map
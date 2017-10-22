"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const JSX_1 = require("../JSX");
const _ = require("lodash");
const renderer_1 = require("../../core/renderer");
const testers_1 = require("../../core/testers");
const path_util_1 = require("../../path.util");
const label_util_1 = require("../label.util");
const core_1 = require("../../core");
const ui_schema_gen_1 = require("../../generators/ui-schema-gen");
const actions_1 = require("../../actions");
const inferno_redux_1 = require("inferno-redux");
const index_1 = require("../../reducers/index");
const dispatch_renderer_1 = require("../dispatch-renderer");
const renderer_util_1 = require("../renderer.util");
exports.getStyle = (styleName) => core_1.JsonForms.stylingRegistry.getAsClassName(styleName);
/**
 * Default tester for an array control.
 * @type {RankedTester}
 */
exports.arrayTester = testers_1.rankWith(2, testers_1.and(testers_1.uiTypeIs('Control'), testers_1.schemaMatches(schema => !_.isEmpty(schema)
    && schema.type === 'array'
    && !_.isEmpty(schema.items)
    && !Array.isArray(schema.items) // we don't care about tuples
), testers_1.schemaSubPathMatches('items', schema => schema.type === 'object')));
class ArrayControlRenderer extends renderer_1.Renderer {
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
        const { schema, uischema, data, path } = this.props;
        const controlElement = uischema;
        const label = label_util_1.getElementLabelObject(schema, controlElement);
        const resolvedSchema = path_util_1.resolveSchema(schema, controlElement.scope.$ref + '/items');
        const className = `control ${(renderer_1.convertToClassName(controlElement.scope.$ref))}`;
        return (JSX_1.JSX.createElement("div", { className: className },
            JSX_1.JSX.createElement("fieldset", { className: exports.getStyle('array.layout') },
                JSX_1.JSX.createElement("legend", null,
                    JSX_1.JSX.createElement("button", { className: exports.getStyle('array.button'), onclick: () => this.addNewItem(path) }, "+"),
                    JSX_1.JSX.createElement("label", { className: 'array.label' }, label.show ? label.text : '')),
                JSX_1.JSX.createElement("div", { className: core_1.JsonForms.stylingRegistry.getAsClassName('array.children') }, data ? data.map((child, index) => {
                    const generatedUi = ui_schema_gen_1.generateDefaultUISchema(resolvedSchema, 'HorizontalLayout');
                    const childPath = path_util_1.compose(path, index + '');
                    return (JSX_1.JSX.createElement(dispatch_renderer_1.default, { schema: resolvedSchema, uischema: generatedUi, path: childPath }));
                }) : JSX_1.JSX.createElement("p", null, "No data")))));
    }
}
exports.ArrayControlRenderer = ArrayControlRenderer;
const mapStateToProps = (state, ownProps) => {
    const path = path_util_1.composeWithUi(ownProps.uischema, ownProps.path);
    return {
        data: path_util_1.resolveData(index_1.getData(state), path),
        uischema: ownProps.uischema,
        schema: ownProps.schema,
        path
    };
};
exports.default = renderer_util_1.registerStartupRenderer(exports.arrayTester, inferno_redux_1.connect(mapStateToProps)(ArrayControlRenderer));
//# sourceMappingURL=array-renderer.js.map
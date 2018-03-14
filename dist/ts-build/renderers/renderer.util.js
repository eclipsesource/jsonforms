"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var JSX_1 = require("./JSX");
var core_1 = require("../core");
var renderer_1 = require("../core/renderer");
var _ = require("lodash");
var dispatch_renderer_1 = require("./dispatch-renderer");
var path_util_1 = require("../path.util");
var label_util_1 = require("./label.util");
var validation_1 = require("../reducers/validation");
var index_1 = require("../reducers/index");
var path_util_2 = require("../path.util");
/**
 * Renderer annotation that defines the renderer as a custom elemeent
 * and registers it with the renderer service.
 *
 * @param {JsonFormsRendererConfig} config the renderer config to be registered
 * @constructor
 */
// Used as annotation
// tslint:disable:variable-name
exports.JsonFormsRenderer = function (config) {
    return function (cls) {
        exports.registerStartupRenderer(config.tester, cls);
    };
};
// tslint:enable:variable-name
exports.mapStateToLayoutProps = function (state, ownProps) {
    var visible = _.has(ownProps, 'visible') ? ownProps.visible : renderer_1.isVisible(ownProps, state);
    return {
        renderers: state.renderers,
        visible: visible,
        path: ownProps.path
    };
};
exports.renderChildren = function (elements, schema, childType, path) {
    if (_.isEmpty(elements)) {
        return [];
    }
    return elements.map(function (child, index) {
        var classes = core_1.JsonForms.stylingRegistry.get(childType, elements.length)
            .concat([childType])
            .join(' ');
        return (JSX_1.JSX.createElement("div", { className: classes, key: path + "-" + index },
            JSX_1.JSX.createElement(dispatch_renderer_1.default, { uischema: child, schema: schema, path: path })));
    });
};
// tslint:disable:variable-name
exports.JsonFormsLayout = function (_a) {
    var styleName = _a.styleName, children = _a.children, visible = _a.visible;
    // tslint:enable:variable-name
    var classNames = core_1.JsonForms.stylingRegistry.getAsClassName(styleName);
    return (JSX_1.JSX.createElement("div", { className: classNames, hidden: visible === undefined || visible === null ? false : !visible }, children));
};
exports.formatErrorMessage = function (errors) {
    if (errors === undefined || errors === null) {
        return '';
    }
    return errors.join('\n');
};
exports.registerStartupRenderer = function (tester, renderer) {
    core_1.JsonForms.renderers.push({
        tester: tester,
        renderer: renderer
    });
    return renderer;
};
var isRequired = function (schema, schemaPath) {
    var pathSegments = schemaPath.split('/');
    var lastSegment = pathSegments[pathSegments.length - 1];
    var nextHigherSchemaSegments = pathSegments.slice(0, pathSegments.length - 2);
    var nextHigherSchemaPath = nextHigherSchemaSegments.join('/');
    var nextHigherSchema = path_util_2.resolveSchema(schema, nextHigherSchemaPath);
    return nextHigherSchema !== undefined
        && nextHigherSchema.required !== undefined
        && nextHigherSchema.required.indexOf(lastSegment) !== -1;
};
exports.computeLabel = function (label, required) {
    return required ? label + '*' : label;
};
exports.mapStateToControlProps = function (state, ownProps) {
    var path = path_util_1.composeWithUi(ownProps.uischema, ownProps.path);
    var visible = _.has(ownProps, 'visible') ? ownProps.visible : renderer_1.isVisible(ownProps, state);
    var enabled = _.has(ownProps, 'enabled') ? ownProps.enabled : renderer_1.isEnabled(ownProps, state);
    var labelObject = label_util_1.getLabelObject(ownProps.uischema);
    var label = labelObject.show ? labelObject.text : '';
    var errors = validation_1.errorAt(path)(index_1.getValidation(state)).map(function (error) { return error.message; });
    var isValid = _.isEmpty(errors);
    var controlElement = ownProps.uischema;
    var ref = controlElement.scope.$ref;
    var id = _.has(controlElement.scope, '$ref') ? ref : '';
    var required = controlElement.scope !== undefined && isRequired(ownProps.schema, controlElement.scope.$ref);
    var styles = core_1.JsonForms.stylingRegistry.get('control');
    var classNames = !_.isEmpty(controlElement.scope) ?
        styles.concat(["" + renderer_1.convertToClassName(ref)]) : [''];
    var inputClassName = ['validate']
        .concat(isValid ? 'valid' : 'invalid');
    var labelClass = core_1.JsonForms.stylingRegistry.getAsClassName('control.label');
    return {
        data: path_util_1.resolveData(index_1.getData(state), path),
        errors: errors,
        classNames: {
            wrapper: classNames.join(' '),
            input: inputClassName.join(' '),
            label: labelClass
        },
        label: label,
        visible: visible,
        enabled: enabled,
        id: id,
        path: path,
        required: required
    };
};
//# sourceMappingURL=renderer.util.js.map
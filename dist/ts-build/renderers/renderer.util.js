"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var JSX_1 = require("./JSX");
var _ = require("lodash");
var core_1 = require("../core");
var renderer_1 = require("../core/renderer");
var dispatch_renderer_1 = require("./dispatch-renderer");
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
    return elements.map(function (child) {
        var classes = core_1.JsonForms.stylingRegistry.get(childType, elements.length)
            .concat([childType])
            .join(' ');
        return (JSX_1.JSX.createElement("div", { className: classes },
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
// tslint:disable:variable-name
exports.JsonFormsControl = 
// tslint:enable:variable-name
function (_a) {
    var classes = _a.classes, controlId = _a.controlId, labelText = _a.labelText, validationErrors = _a.validationErrors, children = _a.children;
    var isValid = _.isEmpty(validationErrors);
    return (JSX_1.JSX.createElement("div", { className: classes },
        JSX_1.JSX.createElement("label", { for: controlId, className: 'control.label' }, labelText),
        children,
        JSX_1.JSX.createElement("div", { className: ['validation'].concat([isValid ? '' : 'validation_error']).join(' ') }, !isValid ? exports.formatErrorMessage(validationErrors) : '')));
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
//# sourceMappingURL=renderer.util.js.map
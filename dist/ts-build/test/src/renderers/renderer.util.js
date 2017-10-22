"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const JSX_1 = require("./JSX");
const _ = require("lodash");
const core_1 = require("../core");
const renderer_1 = require("../core/renderer");
const dispatch_renderer_1 = require("./dispatch-renderer");
/**
 * Renderer annotation that defines the renderer as a custom elemeent
 * and registers it with the renderer service.
 *
 * @param {JsonFormsRendererConfig} config the renderer config to be registered
 * @constructor
 */
// Used as annotation
// tslint:disable:variable-name
exports.JsonFormsRenderer = (config) => (cls) => {
    exports.registerStartupRenderer(config.tester, cls);
};
// tslint:enable:variable-name
exports.mapStateToLayoutProps = (state, ownProps) => {
    const visible = _.has(ownProps, 'visible') ? ownProps.visible : renderer_1.isVisible(ownProps, state);
    return {
        renderers: state.renderers,
        visible,
        path: ownProps.path
    };
};
exports.renderChildren = (elements, schema, childType, path) => {
    if (_.isEmpty(elements)) {
        return [];
    }
    return elements.map(child => {
        const classes = core_1.JsonForms.stylingRegistry.get(childType, elements.length)
            .concat([childType])
            .join(' ');
        return (JSX_1.JSX.createElement("div", { className: classes },
            JSX_1.JSX.createElement(dispatch_renderer_1.default, { uischema: child, schema: schema, path: path })));
    });
};
// tslint:disable:variable-name
exports.JsonFormsLayout = ({ styleName, children, visible }) => {
    // tslint:enable:variable-name
    const classNames = core_1.JsonForms.stylingRegistry.getAsClassName(styleName);
    return (JSX_1.JSX.createElement("div", { className: classNames, hidden: visible === undefined || visible === null ? false : !visible }, children));
};
// tslint:disable:variable-name
exports.JsonFormsControl = 
// tslint:enable:variable-name
({ classes, controlId, labelText, validationErrors, children }) => {
    const isValid = _.isEmpty(validationErrors);
    return (JSX_1.JSX.createElement("div", { className: classes },
        JSX_1.JSX.createElement("label", { for: controlId, className: 'control.label' }, labelText),
        children,
        JSX_1.JSX.createElement("div", { className: ['validation'].concat([isValid ? '' : 'validation_error']).join(' ') }, !isValid ? exports.formatErrorMessage(validationErrors) : '')));
};
exports.formatErrorMessage = errors => {
    if (errors === undefined || errors === null) {
        return '';
    }
    return errors.join('\n');
};
exports.registerStartupRenderer = (tester, renderer) => {
    core_1.JsonForms.renderers.push({
        tester,
        renderer
    });
    return renderer;
};
//# sourceMappingURL=renderer.util.js.map
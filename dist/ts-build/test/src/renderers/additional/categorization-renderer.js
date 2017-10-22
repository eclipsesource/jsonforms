"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const JSX_1 = require("../JSX");
const _ = require("lodash");
const core_1 = require("../../core");
const renderer_1 = require("../../core/renderer");
const testers_1 = require("../../core/testers");
const renderer_util_1 = require("../renderer.util");
const inferno_redux_1 = require("inferno-redux");
const dispatch_renderer_1 = require("../dispatch-renderer");
const isCategorization = (category) => {
    return category.type === 'Categorization';
};
/**
 * Default tester for a categorization.
 * @type {RankedTester}
 */
exports.categorizationTester = testers_1.rankWith(1, testers_1.and(testers_1.uiTypeIs('Categorization'), uischema => {
    const hasCategory = (element) => {
        if (_.isEmpty(element.elements)) {
            return false;
        }
        return element.elements
            .map(elem => isCategorization(elem) ?
            hasCategory(elem) :
            elem.type === 'Category')
            .reduce((prev, curr) => prev && curr, true);
    };
    return hasCategory(uischema);
}));
class CategorizationRenderer extends renderer_1.Renderer {
    /**
     * @inheritDoc
     */
    render() {
        const { uischema, visible, enabled } = this.props;
        const controlElement = uischema;
        const categorization = uischema;
        const classNames = [].concat(core_1.JsonForms.stylingRegistry.getAsClassName('categorization'));
        const masterClassNames = [].concat(core_1.JsonForms.stylingRegistry.getAsClassName('categorization.master'));
        const detailClassNames = [].concat(core_1.JsonForms.stylingRegistry.getAsClassName('categorization.detail'));
        return (JSX_1.JSX.createElement("fieldset", { className: classNames, hidden: visible === null || visible === undefined ? false : !visible, disabled: enabled === null || enabled === undefined ? false : !enabled },
            JSX_1.JSX.createElement("div", { className: masterClassNames }, this.createCategorization(categorization)),
            JSX_1.JSX.createElement("div", { className: detailClassNames }, this.renderCategory(this.findCategory(controlElement)))));
    }
    findCategory(categorization) {
        const category = categorization.elements[0];
        if (this.state && this.state.selected) {
            return this.state.selected.category;
        }
        if (isCategorization(category)) {
            return this.findCategory(category);
        }
        return category;
    }
    renderCategory(category) {
        const { schema, path } = this.props;
        // TODO: add selected style
        if (category.elements === undefined) {
            return (JSX_1.JSX.createElement("div", { id: 'categorization.detail' }));
        }
        return (JSX_1.JSX.createElement("div", { id: 'categorization.detail' }, category.elements.map(child => (JSX_1.JSX.createElement(dispatch_renderer_1.default, { uischema: child, schema: schema, path: path })))));
    }
    createCategorization(categorization, depth = 0) {
        return (JSX_1.JSX.createElement("ul", { className: core_1.JsonForms.stylingRegistry.getAsClassName('category.subcategories') }, categorization.elements.map(category => {
            if (isCategorization(category)) {
                return (JSX_1.JSX.createElement("li", { className: core_1.JsonForms.stylingRegistry.getAsClassName('category.group') },
                    JSX_1.JSX.createElement("span", null, category.label),
                    this.createCategorization(category, depth + 1)));
            }
            else {
                return (JSX_1.JSX.createElement("li", { onClick: () => {
                        this.setState({
                            selected: {
                                category
                            }
                        });
                    } },
                    JSX_1.JSX.createElement("span", null, category.label)));
            }
        })));
    }
}
exports.default = renderer_util_1.registerStartupRenderer(exports.categorizationTester, inferno_redux_1.connect(renderer_util_1.mapStateToLayoutProps)(CategorizationRenderer));
//# sourceMappingURL=categorization-renderer.js.map
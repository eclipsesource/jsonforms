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
var testers_1 = require("../../core/testers");
var renderer_util_1 = require("../renderer.util");
var dispatch_renderer_1 = require("../dispatch-renderer");
var binding_1 = require("../../common/binding");
var isCategorization = function (category) {
    return category.type === 'Categorization';
};
/**
 * Default tester for a categorization.
 * @type {RankedTester}
 */
exports.categorizationTester = testers_1.rankWith(1, testers_1.and(testers_1.uiTypeIs('Categorization'), function (uischema) {
    var hasCategory = function (element) {
        if (_.isEmpty(element.elements)) {
            return false;
        }
        return element.elements
            .map(function (elem) { return isCategorization(elem) ?
            hasCategory(elem) :
            elem.type === 'Category'; })
            .reduce(function (prev, curr) { return prev && curr; }, true);
    };
    return hasCategory(uischema);
}));
var CategorizationRenderer = /** @class */ (function (_super) {
    __extends(CategorizationRenderer, _super);
    function CategorizationRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @inheritDoc
     */
    CategorizationRenderer.prototype.render = function () {
        var _a = this.props, uischema = _a.uischema, visible = _a.visible;
        var controlElement = uischema;
        var categorization = uischema;
        var classNames = core_1.JsonForms.stylingRegistry.getAsClassName('categorization');
        var masterClassNames = core_1.JsonForms.stylingRegistry.getAsClassName('categorization.master');
        var detailClassNames = core_1.JsonForms.stylingRegistry.getAsClassName('categorization.detail');
        var selectedCategory = this.findCategory(controlElement);
        return (JSX_1.JSX.createElement("div", { className: classNames, hidden: visible === null || visible === undefined ? false : !visible },
            JSX_1.JSX.createElement("div", { className: masterClassNames }, this.createCategorization(categorization, selectedCategory)),
            JSX_1.JSX.createElement("div", { className: detailClassNames }, this.renderCategory(selectedCategory))));
    };
    CategorizationRenderer.prototype.findCategory = function (categorization) {
        var category = categorization.elements[0];
        if (this.state && this.state.selected) {
            return this.state.selected.category;
        }
        if (isCategorization(category)) {
            return this.findCategory(category);
        }
        return category;
    };
    CategorizationRenderer.prototype.renderCategory = function (category) {
        var _a = this.props, schema = _a.schema, path = _a.path;
        // TODO: add selected style
        if (category.elements === undefined) {
            return (JSX_1.JSX.createElement("div", { id: 'categorization.detail' }));
        }
        return (JSX_1.JSX.createElement("div", { id: 'categorization.detail' }, (category.elements || []).map(function (child) {
            return (JSX_1.JSX.createElement(dispatch_renderer_1.default, { uischema: child, schema: schema, path: path }));
        })));
    };
    CategorizationRenderer.prototype.getCategoryClassName = function (category, selectedCategory) {
        return selectedCategory === category ? 'selected' : '';
    };
    CategorizationRenderer.prototype.createCategorization = function (categorization, selectedCategory, depth) {
        var _this = this;
        if (depth === void 0) { depth = 0; }
        return (JSX_1.JSX.createElement("ul", { className: core_1.JsonForms.stylingRegistry.getAsClassName('category.subcategories') }, categorization.elements.map(function (category) {
            if (isCategorization(category)) {
                return (JSX_1.JSX.createElement("li", { className: core_1.JsonForms.stylingRegistry.getAsClassName('category.group') },
                    JSX_1.JSX.createElement("span", null, category.label),
                    _this.createCategorization(category, selectedCategory, depth + 1)));
            }
            else {
                return (JSX_1.JSX.createElement("li", { onClick: function () {
                        _this.setState({
                            selected: {
                                category: category
                            }
                        });
                    }, className: _this.getCategoryClassName(category, selectedCategory) },
                    JSX_1.JSX.createElement("span", null, category.label)));
            }
        })));
    };
    return CategorizationRenderer;
}(binding_1.Component));
exports.default = renderer_util_1.registerStartupRenderer(exports.categorizationTester, binding_1.connect(renderer_util_1.mapStateToLayoutProps)(CategorizationRenderer));
//# sourceMappingURL=categorization-renderer.js.map
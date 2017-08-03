"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
/**
 * Styling registry implementation.
 */
var StylingRegistryImpl = (function () {
    function StylingRegistryImpl(styles) {
        if (styles === void 0) { styles = []; }
        this.styles = styles;
    }
    StylingRegistryImpl.prototype.register = function (style, classNames) {
        if (typeof style === 'string') {
            this.deregister(style);
            this.styles.push({ name: style, classNames: classNames });
        }
        else {
            this.deregister(style.name);
            this.styles.push(style);
        }
    };
    StylingRegistryImpl.prototype.registerMany = function (styles) {
        var _this = this;
        styles.forEach(function (style) {
            _this.register(style.name, style.classNames);
        });
    };
    StylingRegistryImpl.prototype.deregister = function (styleName) {
        _.remove(this.styles, function (style) { return style.name === styleName; });
    };
    StylingRegistryImpl.prototype.get = function (styleName) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var foundStyle = _.find(this.styles, function (style) { return style.name === styleName; });
        if (!_.isEmpty(foundStyle) && typeof foundStyle.classNames === 'function') {
            return foundStyle.classNames(args);
        }
        else if (!_.isEmpty(foundStyle)) {
            return foundStyle.classNames;
        }
        return [];
    };
    StylingRegistryImpl.prototype.getAsClassName = function (styleName) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var styles = this.get(styleName, args);
        if (_.isEmpty(styles)) {
            return '';
        }
        return _.join(styles, ' ');
    };
    return StylingRegistryImpl;
}());
exports.StylingRegistryImpl = StylingRegistryImpl;
//# sourceMappingURL=styling.registry.js.map
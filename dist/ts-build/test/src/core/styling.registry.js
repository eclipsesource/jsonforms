"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
/**
 * Styling registry implementation.
 */
class StylingRegistryImpl {
    constructor(styles = []) {
        this.styles = styles;
    }
    register(style, classNames) {
        if (typeof style === 'string') {
            this.deregister(style);
            this.styles.push({ name: style, classNames });
        }
        else {
            this.deregister(style.name);
            this.styles.push(style);
        }
    }
    registerMany(styles) {
        styles.forEach(style => {
            this.register(style.name, style.classNames);
        });
    }
    deregister(styleName) {
        _.remove(this.styles, style => style.name === styleName);
    }
    get(styleName, ...args) {
        const foundStyle = _.find(this.styles, style => style.name === styleName);
        if (!_.isEmpty(foundStyle) && typeof foundStyle.classNames === 'function') {
            return foundStyle.classNames(args);
        }
        else if (!_.isEmpty(foundStyle)) {
            return foundStyle.classNames;
        }
        return [];
    }
    getAsClassName(styleName, ...args) {
        const styles = this.get(styleName, args);
        if (_.isEmpty(styles)) {
            return '';
        }
        return _.join(styles, ' ');
    }
}
exports.StylingRegistryImpl = StylingRegistryImpl;
//# sourceMappingURL=styling.registry.js.map
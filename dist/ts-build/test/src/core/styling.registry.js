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
    /**
     * Obtain the CSS class name associated with the given style name.
     * @param styleName the name whose CSS class names should be obtained
     * @param args any additional arguments necessary for calculating a list of CSS classes to be applied
     * @return {Array<String>} an array containing the CSS class names,
     *         if the style exists, an empty array otherwise
     */
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
    addStyle(html, styleName, ...args) {
        const styles = this.get(styleName, args);
        styles.forEach(style => html.classList.add(style));
        return this;
    }
}
exports.StylingRegistryImpl = StylingRegistryImpl;
//# sourceMappingURL=styling.registry.js.map
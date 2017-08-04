export declare type ClassNames = string[] | ((...args: any[]) => string[]);
/**
 * A style associates a name with a list of CSS class names.
 */
export interface Style {
    name: string;
    classNames: ClassNames;
}
/**
 * A registry of all available styles.
 * A style may be used to alter the appearance of certain elements during
 * the render process.
 */
export interface StylingRegistry {
    /**
     * Register a style.
     * If a style with the given name already exists, it will be overwritten.
     *
     * @param styleName the name of the style
     * @param classNames CSS class names to be applied
     */
    register(styleName: string, classNames: string[]): void;
    /**
     * Register a style.
     * If a style with the given name already exists, it will be overwritten.
     *
     * @param style the style to be registered
     */
    register(style: Style): void;
    /**
     * Register multiple styles at once.
     *
     * @param styles an array of styles to be registered
     */
    registerMany(styles: Style[]): void;
    /**
     * Deregister a style.
     *
     * @param styleName the name of the style to be un-registered
     */
    deregister(styleName: string): void;
    /**
     * Add a style to the given HTML element. A style is association with a list of CSS classes
     * to be assigned to the given HTML element
     *
     * @param {HTMLElement} html the element to which a style should be applied
     * @param {string} styleName the style name to be applied
     * @param args any additional arguments necessary for calculating a list of
     *        CSS classes to be applied
     * @returns {this} the styling registry for convenience reasons
     */
    addStyle(html: Element, styleName: string, ...args: any[]): StylingRegistry;
}
/**
 * Styling registry implementation.
 */
export declare class StylingRegistryImpl implements StylingRegistry {
    protected styles: Style[];
    constructor(styles?: Style[]);
    register(style: Style): void;
    register(name: string, classNames: ClassNames): void;
    registerMany(styles: Style[]): void;
    deregister(styleName: any): void;
    /**
     * Obtain the CSS class name associated with the given style name.
     * @param styleName the name whose CSS class names should be obtained
     * @param args any additional arguments necessary for calculating a list of
     *        CSS classes to be applied
     * @return {Array<String>} an array containing the CSS class names,
     *         if the style exists, an empty array otherwise
     */
    get(styleName: string, ...args: any[]): string[];
    addStyle(html: Element, styleName: string, ...args: any[]): StylingRegistry;
}

import * as _ from 'lodash';

export type ClassNames = string[] | ((...args: any[]) => string[]);

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
     * Obtain the CSS class name associated with the given style name.
     * @param styleName the name whose CSS class names should be obtained
     * @return {Array<String>} an array containing the CSS class names,
     *         if the style exists, an empty array otherwise
     */
    get(styleName: string, ...args: any[]): string[];

    /**
     * Obtain the CSS class name associated with the given style name.
     * @param styleName the name whose CSS class names should be obtained
     * @return a string containing the CSS class name separated by whitespace, if the style exists,
     *         empty string otherwise
     */
    getAsClassName(styleName: string, ...args: any[]): string;
}

/**
 * Styling registry implementation.
 */
export class StylingRegistryImpl implements StylingRegistry {

    constructor(protected styles: Style[] = []) { }

    register(style: Style): void;
    register(name: string, classNames: ClassNames): void;
    register(style: string|Style, classNames?: string[]): void {
        if (typeof style === 'string') {
            this.deregister(style);
            this.styles.push({name: style, classNames});
        } else {
            this.deregister(style.name);
            this.styles.push(style);
        }
    }

    registerMany(styles: Style[]) {
        styles.forEach(style => {
            this.register(style.name, style.classNames);
        });
    }

    deregister(styleName: any) {
        _.remove(this.styles, style => style.name === styleName);
    }

    get(styleName: string, ...args: any[]): string[] {
        const foundStyle = _.find(this.styles, style => style.name === styleName);
        if (!_.isEmpty(foundStyle) && typeof foundStyle.classNames === 'function') {
          return foundStyle.classNames(args);
        } else if (!_.isEmpty(foundStyle)) {
            return (foundStyle.classNames as string[]);
        }

        return [];
    }

    getAsClassName(styleName: string, ...args: any[]): string {
        const styles = this.get(styleName, args);
        if (_.isEmpty(styles)) {
            return '';
        }

        return _.join(styles, ' ');
    }

}

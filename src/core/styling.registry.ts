import * as _ from 'lodash';

export interface Style {
    name: string
    classNames: Array<string>
}

export interface StylingRegistry {
    /**
     * Register a style.
     * If a style with the given name already exists, it will be overwritten.
     *
     * @param styleName the name of the style
     * @param classNames CSS class names to be applied
     */
    register(styleName: string, classNames: Array<string>): void;

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
    registerMany(styles: Array<Style>): void;

    /**
     * Un-register a style.
     *
     * @param styleName the name of the style to be un-registered
     */
    unregister(styleName: string): void;

    /**
     * Obtain the CSS class name associated with the given style name.
     * @param styleName the name whose CSS class names should be obtained
     * @return an array containing the CSS class names, if the style exists,
      an empty array otherwise
     */
    get(styleName: string): Array<string>

    /**
     * Obtain the CSS class name associated with the given style name.
     * @param styleName the name whose CSS class names should be obtained
     * @return a string containing the CSS class name separated by whitespace, if the style exists,
     *         empty string otherwise
     */
    getAsClassName(styleName: string): string
}

export class StylingRegistryImpl implements StylingRegistry {

    constructor(protected styles: Array<Style> = []) {

    }

    register(style: Style): void;
    register(name: string, classNames: string[]): void;
    register(style: string|Style, classNames?: string[]): void {
        if (typeof style === 'string') {
            this.unregister(style);
            this.styles.push({name: style, classNames});
        } else {
            this.unregister(style.name);
            this.styles.push(style);
        }
    }

    registerMany(styles: Array<Style>) {
        styles.forEach(style => this.register(style.name, style.classNames))
    }

    unregister(styleName: any) {
        _.remove(this.styles, style => style.name === styleName);
    }

    get(styleName: string): string[] {
        const foundStyle = _.find(this.styles, style => style.name === styleName);
        if (foundStyle) {
            return foundStyle.classNames;
        }
        return [];
    }

    getAsClassName(styleName: string): string {
        const styles = this.get(styleName);
        if (_.isEmpty(styles)) {
            return '';
        }
        return _.join(styles, ' ');
    }
}

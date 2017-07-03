import {JsonForms} from '../core';
import {Renderer} from '../core/renderer';
import {RankedTester} from '../core/testers';

/**
 * A renderer config that is used during renderer registration.
 */
export interface JsonFormsRendererConfig {
    /**
     * The HTML element tag name of the renderer.
     */
    selector: string;

    /**
     * The tester that that determines how applicable
     * the renderer is.
     */
    tester: RankedTester;
}

export interface JsonFormsRendererConstructable {
    new(): Renderer;
}

/**
 * Renderer annotation that defines the renderer as a custom elemeent
 * and registers it with the renderer service.
 *
 * @param {JsonFormsRendererConfig} config the renderer config to be registered
 * @constructor
 */
// Used as annotation
// tslint:disable:variable-name
export const JsonFormsRenderer =
    (config: JsonFormsRendererConfig) =>
        (cls: JsonFormsRendererConstructable) => {
            customElements.define(config.selector, cls);
            JsonForms.rendererService.registerRenderer(config.tester, config.selector);
        };
// tslint:enable:variable-name

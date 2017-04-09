import {JsonFormsHolder} from '../core';
import {Renderer} from '../core/renderer';
import {RankedTester} from '../core/testers';
export interface JsonFormsRendererConfig {
  selector: string;
  tester: RankedTester;
}
export interface JsonFormsRendererConstructable {
  new(): Renderer;
}
export const JsonFormsRenderer =
    (config: JsonFormsRendererConfig) =>
    (cls: JsonFormsRendererConstructable) => {
    customElements.define(config.selector, cls);
  JsonFormsHolder.rendererService.registerRenderer(config.tester, config.selector);
};

import { RendererTester, Renderer, JsonFormsHolder } from '../core';

interface JsonFormsRendererConfig {
  selector: string;
  tester: RendererTester;
}
interface JsonFormsRendererConstructable {
  new(): Renderer;
}
export const JsonFormsRenderer =
    (config: JsonFormsRendererConfig) =>
    (cls: JsonFormsRendererConstructable) => {
    customElements.define(config.selector, cls);
  JsonFormsHolder.rendererService.registerRenderer(config.tester, config.selector);
};

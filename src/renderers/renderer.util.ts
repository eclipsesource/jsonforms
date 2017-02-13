import {RendererTester, Renderer, JsonFormsHolder} from "../core";
import {JsonSchema} from "../models/jsonSchema";
interface JsonFormsRendererConfig {
  selector: string;
  tester: RendererTester;
}
interface JsonFormsRendererConstructable {
  new(): Renderer;
}
export const JsonFormsRenderer = (config: JsonFormsRendererConfig) => (cls: JsonFormsRendererConstructable) => {
  window.customElements.define(config.selector, cls);
  JsonFormsHolder.rendererService.registerRenderer(config.tester, config.selector);
};

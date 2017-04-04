import {UISchemaElement} from '../models/uischema';
import {JsonSchema} from '../models/jsonSchema';
import {DataService} from './data.service';
import {Renderer} from './renderer';

export interface RendererTester {
    (element: UISchemaElement, schema: JsonSchema): number;
}
export class RendererService {
  private renderers: Array<{tester: RendererTester, renderer: string}> = [];
  registerRenderer(tester: RendererTester, renderer: string): void {
    this.renderers.push({tester: tester, renderer: renderer});
  }
  unregisterRenderer(tester: RendererTester, renderer: string): void {
    const index = this.renderers.indexOf({tester: tester, renderer: renderer});
    this.renderers = this.renderers.splice(index, 1);
  }
  getBestRenderer(uischema: UISchemaElement,
                  schema: JsonSchema,
                  dataService: DataService): HTMLElement {
    let bestRenderer: string;
    let specificity = -1;
    this.renderers.forEach(renderer => {
      const rSpec = renderer.tester(uischema, schema);
      if (rSpec > specificity) {
        bestRenderer = renderer.renderer;
        specificity = rSpec;
      }
    });
    let renderer: HTMLElement;
    if (bestRenderer === undefined) {
      renderer =  document.createElement('label');
      renderer.textContent = 'Unknown Schema: ' + JSON.stringify(uischema);
    } else {
      const cRenderer = <Renderer> document.createElement(bestRenderer);
      cRenderer.setUiSchema(uischema);
      cRenderer.setDataSchema(schema);
      cRenderer.setDataService(dataService);
      renderer = cRenderer;
    }
    return renderer;
  }
}

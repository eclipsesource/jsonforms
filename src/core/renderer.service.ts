import * as _ from 'lodash';
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
    this.renderers.push({tester, renderer});
  }
  unregisterRenderer(tester: RendererTester, renderer: string): void {
    this.renderers = _.filter(this.renderers, r =>
        // compare testers via strict equality
        r.tester !== tester || !_.eq(r.renderer, renderer)
    );
  }
  getBestRenderer(uischema: UISchemaElement,
                  schema: JsonSchema,
                  dataService: DataService): HTMLElement {
    const bestRenderer = _.maxBy(this.renderers, renderer =>
        renderer.tester(uischema, schema)
    );
    if (bestRenderer === undefined) {
      const renderer = document.createElement('label');
      renderer.textContent = 'Unknown Schema: ' + JSON.stringify(uischema);
      return renderer;
    } else {
      const renderer = <Renderer> document.createElement(bestRenderer.renderer);
      renderer.setUiSchema(uischema);
      renderer.setDataSchema(schema);
      renderer.setDataService(dataService);
      return renderer;
    }
  }
}

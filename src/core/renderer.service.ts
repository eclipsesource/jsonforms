import * as _ from 'lodash';
import {UISchemaElement} from '../models/uischema';
import {JsonSchema} from '../models/jsonSchema';
import {DataService} from './data.service';
import {Renderer} from './renderer';
import {RankedTester} from './testers';
import {FullDataModelType} from '../parser/item_model';

export class RendererService {
  private renderers: Array<{tester: RankedTester, renderer: string}> = [];
  registerRenderer(tester: RankedTester, renderer: string): void {
    this.renderers.push({tester, renderer});
  }
  unregisterRenderer(tester: RankedTester, renderer: string): void {
    this.renderers = _.filter(this.renderers, r =>
        // compare testers via strict equality
        r.tester !== tester || !_.eq(r.renderer, renderer)
    );
  }
  getBestRenderer(uischema: UISchemaElement,
                  model: FullDataModelType,
                  dataService: DataService): HTMLElement {
    const bestRenderer = _.maxBy(this.renderers, renderer =>
        renderer.tester(uischema, model)
    );
    if (bestRenderer === undefined) {
      const renderer = document.createElement('label');
      renderer.textContent = 'Unknown Schema: ' + JSON.stringify(uischema);
      return renderer;
    } else {
      const renderer = <Renderer> document.createElement(bestRenderer.renderer);
      renderer.setUiSchema(uischema);
      renderer.setDataModel(model);
      renderer.setDataService(dataService);
      return renderer;
    }
  }
}

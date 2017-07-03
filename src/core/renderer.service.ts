import * as _ from 'lodash';
import {JsonSchema} from '../models/jsonSchema';
import {UISchemaElement} from '../models/uischema';
import {DataService} from './data.service';
import {Renderer} from './renderer';
import {RankedTester} from './testers';

/**
 * The renderer service maintains a list of renderers and
 * is responsible for finding the most applicable one given a UI schema, a schema
 * and a data service.
 */
export class RendererService {
  private renderers: {tester: RankedTester, renderer: string}[] = [];

  /**
   * Register a renderer. A renderer is represented by the tag name of the corresponding
   * HTML element, which is assumed to have been registered as a custom element.
   *
   * @param {RankedTester} tester a tester that determines whether when the renderer should be used
   * @param {string} renderer the tag name of the HTML element that represents the renderer
   */
  registerRenderer(tester: RankedTester, renderer: string): void {
    this.renderers.push({tester, renderer});
  }

  /**
   * Deregister a renderer.
   *
   * @param {RankedTester} tester the tester of the renderer to be un-registered.
   *        Note that strict equality is used when un-registering renderers.
   * @param {string} renderer the tag name of the HTML element that represents
   *        the renderer to be un-registered
   */
  deregisterRenderer(tester: RankedTester, renderer: string): void {
    this.renderers = _.filter(this.renderers, r =>
        // compare testers via strict equality
        r.tester !== tester || !_.eq(r.renderer, renderer)
    );
  }

  /**
   * Find the renderer that is capable of rendering the given UI schema.
   * @param {UISchemaElement} uiSchema the UI schema to be rendered
   * @param {JsonSchema} schema the JSON data schema the associated data schema
   * @param {DataService} dataService the data service holding the data to be rendered
   * @return {HTMLElement} the rendered HTML element
   */
  findMostApplicableRenderer(uiSchema: UISchemaElement,
                             schema: JsonSchema,
                             dataService: DataService): HTMLElement {
    const bestRenderer = _.maxBy(this.renderers, renderer =>
        renderer.tester(uiSchema, schema)
    );
    if (bestRenderer === undefined) {
      const renderer = document.createElement('label');
      renderer.textContent = 'Unknown Schema: ' + JSON.stringify(uiSchema);

      return renderer;
    } else {
      const renderer = document.createElement(bestRenderer.renderer) as Renderer;
      renderer.setUiSchema(uiSchema);
      renderer.setDataSchema(schema);
      renderer.setDataService(dataService);

      return renderer;
    }
  }
}

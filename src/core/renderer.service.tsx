import * as _ from 'lodash';
import { JsonSchema } from '../models/jsonSchema';
import { UISchemaElement } from '../models/uischema';
import { RankedTester } from './testers';
import { JsonFormsRendererConstructable } from '../renderers/renderer.util';
import { Store } from 'redux';
import { DispatchRenderer } from '../renderers/dispatch.renderer';

/**
 * The renderer service maintains a list of renderers and
 * is responsible for finding the most applicable one given a UI schema, a schema
 * and a data service.infer
 */
export class RendererService {

  renderers: { tester: RankedTester, renderer: JsonFormsRendererConstructable }[] = [];

  /**
   * Register a renderer. A renderer is represented by the tag name of the corresponding
   * HTML element, which is assumed to have been registered as a custom element.
   *
   * @param {RankedTester} tester a tester that determines whether when the renderer should be used
   * @param {string} renderer the tag name of the HTML element that represents the renderer
   */
  registerRenderer(tester: RankedTester, renderer: JsonFormsRendererConstructable): any {
    this.renderers.push({tester, renderer});

    return renderer;
  }

  /**
   * Deregister a renderer.
   *
   * @param {RankedTester} tester the tester of the renderer to be un-registered.
   *        Note that strict equality is used when un-registering renderers.
   * @param {string} renderer the tag name of the HTML element that represents
   *        the renderer to be un-registered
   */
  deregisterRenderer(tester: RankedTester, renderer: JsonFormsRendererConstructable): void {
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
  findMostApplicableRenderer(uischema: UISchemaElement,
                             schema: JsonSchema,
                             store: Store<any>) {

    // TODO: I think we don't need the store here
    return <DispatchRenderer
      uischema={uischema}
      store={store}
      schema={schema}
    />;
  }
}

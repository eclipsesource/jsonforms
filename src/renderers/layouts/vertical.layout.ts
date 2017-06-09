import {VerticalLayout} from '../../models/uischema';
import {JsonFormsHolder} from '../../core';
import {Renderer} from '../../core/renderer';
import {JsonFormsRenderer} from '../renderer.util';
import {RUNTIME_TYPE} from '../../core/runtime';
import {createRuntimeNotificationEvaluator} from './layout.util';
import {rankWith, uiTypeIs, RankedTester} from '../../core/testers';

/**
 * Default tester for a vertical layout.
 * @type {RankedTester}
 */
export const verticalLayoutTester: RankedTester = rankWith(1, uiTypeIs('VerticalLayout'));

/**
 * Default renderer for a vertical layout.
 */
@JsonFormsRenderer({
  selector: 'jsonforms-verticallayout',
  tester: verticalLayoutTester
})
export class VerticalLayoutRenderer extends Renderer {
  private evaluateRuntimeNotification: (type: RUNTIME_TYPE) => void;
  constructor() {
    super();
  }

  /**
   * @inheritDoc
   */
  render(): HTMLElement {
    const div = document.createElement('div');
    div.className = 'vertical-layout';
    const verticalLayout = <VerticalLayout> this.uischema;
    if (verticalLayout.elements !== undefined && verticalLayout.elements !== null) {
      verticalLayout.elements.forEach(element => {
        const bestRenderer = JsonFormsHolder.rendererService
          .getBestRenderer(element, this.dataSchema, this.dataService);
        div.appendChild(bestRenderer);
      });
    }
    this.appendChild(div);
    this.evaluateRuntimeNotification = createRuntimeNotificationEvaluator(this, this.uischema);
    return this;
  }

  /**
   * @inheritDoc
   */
  dispose(): void {
    // Do nothing
  }

  /**
   * @inheritDoc
   */
  notify(type: RUNTIME_TYPE): void {
    this.evaluateRuntimeNotification(type);
  }
}

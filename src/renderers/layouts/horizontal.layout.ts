import { HorizontalLayout } from '../../models/uischema';
import {JsonForms} from '../../core';
import {Renderer} from '../../core/renderer';
import { JsonFormsRenderer } from '../renderer.util';
import {RUNTIME_TYPE} from '../../core/runtime';
import {createRuntimeNotificationEvaluator} from './layout.util';
import {uiTypeIs, rankWith, RankedTester} from '../../core/testers';

/**
 * Default tester for a horizontal layout.
 * @type {RankedTester}
 */
export const horizontalLayoutTester: RankedTester = rankWith(1, uiTypeIs('HorizontalLayout'));

/**
 * Default renderer for a horizontal layout.
 */
@JsonFormsRenderer({
  selector: 'jsonforms-horizontallayout',
  tester: horizontalLayoutTester
})
export class HorizontalLayoutRenderer extends Renderer {
  private evaluateRuntimeNotification: (type: RUNTIME_TYPE) => void;
  constructor() {
    super();
  }

  /**
   * @inheritDoc
   */
  render(): HTMLElement {
    const div = document.createElement('div');
    div.className = 'horizontal-layout';
    const horizontalLayout = <HorizontalLayout> this.uischema;
    if (horizontalLayout.elements !== undefined && horizontalLayout.elements !== null) {
      horizontalLayout.elements.forEach(element => {
        const bestRenderer = JsonForms.rendererService
            .findMostApplicableRenderer(element, this.dataSchema, this.dataService);
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
  runtimeUpdated(type: RUNTIME_TYPE): void {
    this.evaluateRuntimeNotification(type);
  }
}

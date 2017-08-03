import { JsonForms } from '../../core';
import { Renderer } from '../../core/renderer';
import { RUNTIME_TYPE } from '../../core/runtime';
import { RankedTester, rankWith, uiTypeIs } from '../../core/testers';
import { HorizontalLayout } from '../../models/uischema';
import { JsonFormsRenderer } from '../renderer.util';
import { createRuntimeNotificationEvaluator } from './layout.util';

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
    div.className = JsonForms.stylingRegistry.getAsClassName('horizontal-layout');
    const horizontalLayout = this.uischema as HorizontalLayout;
    if (horizontalLayout.elements !== undefined && horizontalLayout.elements !== null) {
      horizontalLayout.elements.forEach(element => {
        const bestRenderer = JsonForms.rendererService
            .findMostApplicableRenderer(element, this.dataSchema, this.dataService);
        div.appendChild(bestRenderer);
      });
    }
    this.appendChild(div);

    const childrenSize = div.children.length;
    for (let i = 0; i < childrenSize; i++) {
      const itemStyle = JsonForms.stylingRegistry.getAsClassName('horizontal-layout-item', childrenSize);
      div.children.item(i).className = itemStyle;
    }

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

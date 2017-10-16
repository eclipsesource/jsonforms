import { JsonForms } from '../../core';
import { Renderer } from '../../core/renderer';
import { RUNTIME_TYPE } from '../../core/runtime';
import { RankedTester, rankWith, uiTypeIs } from '../../core/testers';
import { GroupLayout } from '../../models/uischema';
import { JsonFormsRenderer } from '../renderer.util';
import { createRuntimeNotificationEvaluator } from './layout.util';

/**
 * Default tester for a group layout.
 *
 * @type {RankedTester}
 */
export const groupTester: RankedTester = rankWith(1, uiTypeIs('Group'));

/**
 * Default renderer for a group layout.
 */
@JsonFormsRenderer({
  selector: 'jsonforms-grouplayout',
  tester: groupTester
})
export class GroupLayoutRenderer extends Renderer {
  private evaluateRuntimeNotification: (type: RUNTIME_TYPE) => void;
  constructor() {
    super();
  }

  /**
   * @inheritDoc
   */
  render(): HTMLElement {
    const group = this.uischema as GroupLayout;
    const fieldSet = document.createElement('fieldset');
    JsonForms.stylingRegistry.addStyle(fieldSet, 'group-layout');
    if (group.label !== undefined) {
      const legend = document.createElement('legend');
      legend.innerText = group.label;
      fieldSet.appendChild(legend);
      JsonForms.stylingRegistry.addStyle(legend, 'group-label');
    }
    if (group.elements !== undefined && group.elements !== null) {
      group.elements.forEach(element => {
        const bestRenderer = JsonForms.rendererService
            .findMostApplicableRenderer(element, this.dataSchema, this.dataService);
        fieldSet.appendChild(bestRenderer);
      });
    }
    this.appendChild(fieldSet);

    const childrenSize = fieldSet.children.length;
    for (let i = 0; i < childrenSize; i++) {
      const child = fieldSet.children.item(i);
      JsonForms.stylingRegistry
        .addStyle(child, 'group-layout-item', childrenSize);
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

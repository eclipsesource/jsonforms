import { GroupLayout } from '../../models/uischema';
import { JsonForms } from '../../core';
import { Renderer } from '../../core/renderer';
import { JsonFormsRenderer } from '../renderer.util';
import { RUNTIME_TYPE } from '../../core/runtime';
import { createRuntimeNotificationEvaluator } from './layout.util';
import {uiTypeIs, rankWith, RankedTester} from '../../core/testers';

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
    const group = <GroupLayout> this.uischema;
    const fieldset = document.createElement('fieldset');
    fieldset.className = 'group-layout';
    if (group.label !== undefined) {
      const legend = document.createElement('legend');
      legend.innerText = group.label;
      fieldset.appendChild(legend);
    }
    if (group.elements !== undefined && group.elements !== null) {
      group.elements.forEach(element => {
        const bestRenderer = JsonForms.rendererService
            .findMostApplicableRenderer(element, this.dataSchema, this.dataService);
        fieldset.appendChild(bestRenderer);
      });
    }
    this.appendChild(fieldset);
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

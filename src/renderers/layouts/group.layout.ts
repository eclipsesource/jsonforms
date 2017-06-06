import { GroupLayout } from '../../models/uischema';
import { JsonFormsHolder } from '../../core';
import { Renderer } from '../../core/renderer';
import { JsonFormsRenderer } from '../renderer.util';
import { RUNTIME_TYPE } from '../../core/runtime';
import { createRuntimeNotificationEvaluator } from './layout.util';
import {uiTypeIs, rankWith, RankedTester} from '../../core/testers';

export const groupTester: RankedTester = rankWith(1, uiTypeIs('Group'));

@JsonFormsRenderer({
  selector: 'jsonforms-grouplayout',
  tester: groupTester
})
export class GroupLayoutRenderer extends Renderer {
  private evaluateRuntimeNotification: (type: RUNTIME_TYPE) => void;
  constructor() {
    super();
  }
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
        const bestRenderer = JsonFormsHolder.rendererService
            .getBestRenderer(element, this.dataModel, this.dataService);
        fieldset.appendChild(bestRenderer);
      });
    }
    this.appendChild(fieldset);
    this.evaluateRuntimeNotification = createRuntimeNotificationEvaluator(this, this.uischema);
    return this;
  }
   dispose(): void {
    // Do nothing
  }
  notify(type: RUNTIME_TYPE): void {
    this.evaluateRuntimeNotification(type);
  }
}

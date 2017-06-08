import { HorizontalLayout } from '../../models/uischema';
import {JsonFormsHolder} from '../../core';
import {Renderer} from '../../core/renderer';
import { JsonFormsRenderer } from '../renderer.util';
import {RUNTIME_TYPE} from '../../core/runtime';
import {createRuntimeNotificationEvaluator} from './layout.util';
import {uiTypeIs, rankWith, RankedTester} from '../../core/testers';

export const horizontalLayoutTester: RankedTester = rankWith(1, uiTypeIs('HorizontalLayout'));

@JsonFormsRenderer({
  selector: 'jsonforms-horizontallayout',
  tester: horizontalLayoutTester
})
export class HorizontalLayoutRenderer extends Renderer {
  private evaluateRuntimeNotification: (type: RUNTIME_TYPE) => void;
  constructor() {
    super();
  }
  render(): HTMLElement {
    const div = document.createElement('div');
    div.className = 'horizontal-layout';
    const horizontalLayout = <HorizontalLayout> this.uischema;
    if (horizontalLayout.elements !== undefined && horizontalLayout.elements !== null) {
      horizontalLayout.elements.forEach(element => {
        const bestRenderer = JsonFormsHolder.rendererService
            .getBestRenderer(element, this.dataModel, this.dataService);
        div.appendChild(bestRenderer);
      });
    }
    this.appendChild(div);
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

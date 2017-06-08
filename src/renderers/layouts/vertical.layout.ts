import {VerticalLayout} from '../../models/uischema';
import {JsonFormsHolder} from '../../core';
import {Renderer} from '../../core/renderer';
import {JsonFormsRenderer} from '../renderer.util';
import {RUNTIME_TYPE} from '../../core/runtime';
import {createRuntimeNotificationEvaluator} from './layout.util';
import {rankWith, uiTypeIs, RankedTester} from '../../core/testers';

export const verticalLayoutTester: RankedTester = rankWith(1, uiTypeIs('VerticalLayout'));

@JsonFormsRenderer({
  selector: 'jsonforms-verticallayout',
  tester: verticalLayoutTester
})
export class VerticalLayoutRenderer extends Renderer {
  private evaluateRuntimeNotification: (type: RUNTIME_TYPE) => void;
  constructor() {
    super();
  }
  render(): HTMLElement {
    const div = document.createElement('div');
    div.className = 'vertical-layout';
    const verticalLayout = <VerticalLayout> this.uischema;
    if (verticalLayout.elements !== undefined && verticalLayout.elements !== null) {
      verticalLayout.elements.forEach(element => {
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

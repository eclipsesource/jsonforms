import { UISchemaElement, VerticalLayout } from '../../models/uischema';
import { JsonFormsHolder} from '../../core';
import {Renderer} from '../../core/renderer';
import { JsonFormsRenderer } from '../renderer.util';
import {Runtime, RUNTIME_TYPE} from '../../core/runtime';

export const VerticalLayoutRendererTester = (uischema: UISchemaElement) =>
  uischema !== undefined && uischema !== null && uischema.type === 'VerticalLayout' ? 1 : -1;
@JsonFormsRenderer({
  selector: 'jsonforms-verticallayout',
  tester: VerticalLayoutRendererTester
})
export class VerticalLayoutRenderer extends Renderer {

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
          .getBestRenderer(element, this.dataSchema, this.dataService);
        div.appendChild(bestRenderer);
      });
    }
    this.appendChild(div);
    return this;
  }
  dispose(): void {
    // Do nothing
  }
  notify(type: RUNTIME_TYPE): void {
    const runtime = <Runtime>this.uischema['runtime'];
    switch (type) {
      case RUNTIME_TYPE.VISIBLE:
        this.hidden = !runtime.visible;
        break;
      case RUNTIME_TYPE.ENABLED:
        if (!runtime.enabled) {
          this.firstElementChild.setAttribute('disabled', 'true');
        } else {
          this.firstElementChild.removeAttribute('disabled');
        }
        break;
    }
  }
}

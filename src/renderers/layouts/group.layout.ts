import { UISchemaElement, GroupLayout } from '../../models/uischema';
import {JsonFormsHolder} from '../../core';
import {Renderer} from '../../core/renderer';
import { JsonFormsRenderer } from '../renderer.util';
import {Runtime, RUNTIME_TYPE} from '../../core/runtime';

export const GroupLayoutRendererTester = (uischema: UISchemaElement) =>
  uischema !== undefined && uischema !== null && uischema.type === 'Group' ? 1 : -1;
@JsonFormsRenderer({
  selector: 'jsonforms-grouplayout',
  tester: GroupLayoutRendererTester
})
export class GroupLayoutRenderer extends Renderer {

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
            .getBestRenderer(element, this.dataSchema, this.dataService);
        fieldset.appendChild(bestRenderer);
      });
    }
    this.appendChild(fieldset);
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

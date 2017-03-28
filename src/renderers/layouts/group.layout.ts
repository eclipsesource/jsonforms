import { UISchemaElement, GroupLayout } from '../../models/uischema';
import {JsonFormsHolder} from '../../core';
import {Renderer} from '../../core/renderer';
import { JsonFormsRenderer } from '../renderer.util';
import {Runtime} from '../../core/runtime';

@JsonFormsRenderer({
  selector: 'jsonforms-grouplayout',
  tester: (uischema: UISchemaElement) => uischema.type === 'Group' ? 1 : -1
})
class VerticalLayoutRenderer extends Renderer {

  constructor() {
    super();
  }
  render(): HTMLElement {
    const group = <GroupLayout> this.uischema;
    const div = document.createElement('div');
    div.className = 'group-layout';
    const fieldset = document.createElement('fieldset');
    if (group.label !== undefined) {
      const legend = document.createElement('legend');
      legend.innerText = group.label;
      fieldset.appendChild(legend);
    }
    group.elements.forEach(element => {
      const bestRenderer = JsonFormsHolder.rendererService
          .getBestRenderer(element, this.dataSchema, this.dataService);
      fieldset.appendChild(bestRenderer);
    });
    div.appendChild(fieldset);
    this.appendChild(div);
    return this;
  }
   dispose(): void {
    // Do nothing
  }
}

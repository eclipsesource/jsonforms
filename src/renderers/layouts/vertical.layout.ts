import { UISchemaElement, VerticalLayout } from '../../models/uischema';
import { JsonFormsHolder} from '../../core';
import {Renderer} from '../../core/renderer';
import { JsonFormsRenderer } from '../renderer.util';
import {Runtime} from '../../core/runtime';

@JsonFormsRenderer({
  selector: 'jsonforms-verticallayout',
  tester: (uischema: UISchemaElement) => uischema.type === 'VerticalLayout' ? 1 : -1
})
class VerticalLayoutRenderer extends Renderer {

  constructor() {
    super();
  }
  render(): HTMLElement {
    const div = document.createElement('div');
    div.className = 'vertical-layout';
    (<VerticalLayout> this.uischema).elements.forEach(element => {
      const bestRenderer = JsonFormsHolder.rendererService
          .getBestRenderer(element, this.dataSchema, this.dataService);
      div.appendChild(bestRenderer);
    });
    this.appendChild(div);
    return this;
  }
   dispose(): void {
    // Do nothing
  }
}

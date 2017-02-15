import { UISchemaElement, VerticalLayout } from '../../models/uischema';
import { Renderer, JsonFormsHolder } from '../../core';
import { JsonFormsRenderer } from '../renderer.util';

@JsonFormsRenderer({
  selector: 'jsonforms-verticallayout',
  tester: (uischema: UISchemaElement) => uischema.type === 'VerticalLayout' ? 1 : -1
})
class VerticalLayoutRenderer extends Renderer {

  constructor() {
    super();
  }

  connectedCallback() {
    const div = document.createElement('div');
    div.className = 'vertical-layout';
    (<VerticalLayout> this.uischema).elements.forEach(element => {
      const bestRenderer = JsonFormsHolder.rendererService
          .getBestRenderer(element, this.dataSchema, this.dataService);
      div.appendChild(bestRenderer);
    });
    this.appendChild(div);
  }
}

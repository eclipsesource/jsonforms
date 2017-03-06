import { UISchemaElement, HorizontalLayout } from '../../models/uischema';
import { Renderer, JsonFormsHolder, Runtime } from '../../core';
import { JsonFormsRenderer } from '../renderer.util';

@JsonFormsRenderer({
  selector: 'jsonforms-horizontallayout',
  tester: (uischema: UISchemaElement) => uischema.type === 'HorizontalLayout' ? 1 : -1
})
class HorizontalLayoutRenderer extends Renderer {

  constructor() {
    super();
  }
  render(): HTMLElement {
    const div = document.createElement('div');
    div.className = 'horizontal-layout';
    (<HorizontalLayout> this.uischema).elements.forEach(element => {
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

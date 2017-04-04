import { UISchemaElement, HorizontalLayout } from '../../models/uischema';
import { JsonFormsHolder} from '../../core';
import {Renderer} from '../../core/renderer';
import { JsonFormsRenderer } from '../renderer.util';
import {Runtime} from '../../core/runtime';

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

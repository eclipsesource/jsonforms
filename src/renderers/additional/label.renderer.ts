import { UISchemaElement, LabelElement } from '../../models/uischema';
import {JsonFormsHolder} from '../../core';
import {Renderer} from '../../core/renderer';
import { JsonFormsRenderer } from '../renderer.util';
import {Runtime} from '../../core/runtime';

@JsonFormsRenderer({
  selector: 'jsonforms-label',
  tester: (uischema: UISchemaElement) => uischema.type === 'Label' ? 1 : -1
})
class LabelRenderer extends Renderer {

  constructor() {
    super();
  }
  render(): HTMLElement {
    const labelElement = <LabelElement> this.uischema;
    const label = document.createElement('label');
    if (typeof labelElement.text === 'string') {
      label.innerText = labelElement.text;
    }
    this.appendChild(label);
    this.className = 'jsf-label';
    return this;
  }
   dispose(): void {
    // Do nothing
  }
}

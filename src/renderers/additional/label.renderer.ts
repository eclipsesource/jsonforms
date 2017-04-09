import { LabelElement } from '../../models/uischema';
import { Renderer } from '../../core/renderer';
import { JsonFormsRenderer } from '../renderer.util';
import { rankWith, uiTypeIs } from '../../core/testers';

@JsonFormsRenderer({
  selector: 'jsonforms-label',
  tester: rankWith(1, uiTypeIs('Label'))
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

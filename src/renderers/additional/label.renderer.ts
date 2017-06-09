import { LabelElement } from '../../models/uischema';
import { Renderer } from '../../core/renderer';
import { JsonFormsRenderer } from '../renderer.util';
import { rankWith, uiTypeIs, RankedTester } from '../../core/testers';
import {Runtime, RUNTIME_TYPE} from '../../core/runtime';

/**
 * Default tester for a label.
 * @type {RankedTester}
 */
export const labelRendererTester: RankedTester = rankWith(1, uiTypeIs('Label'));

/**
 * Default renderer for a label.
 */
@JsonFormsRenderer({
  selector: 'jsonforms-label',
  tester: labelRendererTester
})
export class LabelRenderer extends Renderer {

  constructor() {
    super();
  }

  /**
   * @inheritDoc
   */
  render(): HTMLElement {
    const labelElement = <LabelElement> this.uischema;
    if (labelElement.text !== undefined && labelElement.text !== null) {
      this.textContent = labelElement.text;
    }
    this.className = 'jsf-label';
    return this;
  }

  /**
   * @inheritDoc
   */
  dispose(): void {
    // Do nothing
  }

  /**
   * @inheritDoc
   * @param type
   */
  notify(type: RUNTIME_TYPE): void {
    const runtime = <Runtime>this.uischema['runtime'];
    switch (type) {
      case RUNTIME_TYPE.VISIBLE:
        this.hidden = !runtime.visible;
        break;
      case RUNTIME_TYPE.ENABLED:
        if (!runtime.enabled) {
          this.setAttribute('disabled', 'true');
        } else {
          this.removeAttribute('disabled');
        }
        break;
    }
  }
}

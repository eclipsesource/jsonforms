import { LabelElement } from '../../models/uischema';
import { JsonFormsRenderer } from '../renderer.util';
import { Renderer } from '../../core/renderer';
import { RankedTester, rankWith, uiTypeIs } from '../../core/testers';
import { Runtime, RUNTIME_TYPE } from '../../core/runtime';
import { JsonForms } from '../../core';

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
    const labelElement: LabelElement = this.uischema as LabelElement;
    if (labelElement.text !== undefined && labelElement.text !== null) {
      this.textContent = labelElement.text;
    }
    JsonForms.stylingRegistry.addStyle(this, 'label-control');

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
  runtimeUpdated(type: RUNTIME_TYPE): void {
    const runtime: Runtime = this.uischema.runtime;
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
      default:
    }
  }
}

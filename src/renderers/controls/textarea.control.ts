import {and, optionIs, RankedTester, rankWith, uiTypeIs} from '../../core/testers';
import {JsonFormsRenderer} from '../renderer.util';
import {BaseControl} from './base.control';

/**
 * Tester for a multi-line string control.
 * @type {RankedTester}
 */
export const textAreaControlTester: RankedTester = rankWith(2, and(
    uiTypeIs('Control'),
    optionIs('multi', true)
  ));

/**
 * Renderer for a multi-line string control.
 */
@JsonFormsRenderer({
  selector: 'jsonforms-textarea',
  tester: textAreaControlTester
})
export class TextAreaControl extends BaseControl<HTMLTextAreaElement> {

  /**
   * @inheritDoc
   */
  protected configureInput(input: HTMLTextAreaElement): void {
    input.classList.add('form-control');
  }

  /**
   * @inheritDoc
   */
  protected get valueProperty(): string {
    return 'value';
  }

  /**
   * @inheritDoc
   */
  protected get inputChangeProperty(): string {
    return 'oninput';
  }

  /**
   * @inheritDoc
   */
  protected convertModelValue(value: any): any {
    return (value === undefined || value === null) ? '' : value;
  }

  /**
   * @inheritDoc
   */
  protected createInputElement(): HTMLTextAreaElement {
    return document.createElement('textarea');
  }
}

import { TextControl } from '../../src/renderers/controls/text.control';
import { JsonFormsRenderer } from '../../src/renderers/renderer.util';
import { ControlElement } from '../../src/models/uischema';
import { uiTypeIs, rankWith, RankedTester } from '../../src/core/testers';

declare var componentHandler;

export const materialTextControlTester: RankedTester = rankWith(2, uiTypeIs('Control'));

@JsonFormsRenderer({
  selector: 'jsonforms-materialtext',
  tester: materialTextControlTester
})
export class MaterialTextControl extends TextControl {
  render(): HTMLElement {
    super.render();
    const label = this.getElementsByTagName('label')[0];
    label.htmlFor = (<ControlElement>this.uischema).scope.$ref;
    label.classList.add('mdl-textfield__label');
    const input = this.getElementsByTagName('input')[0];
    input.id = (<ControlElement>this.uischema).scope.$ref;
    input.classList.add('mdl-textfield__input');
    this.classList.add('mdl-textfield');
    this.classList.add('mdl-js-textfield');
    this.classList.add('mdl-textfield--floating-label');
    componentHandler.upgradeElement(this);
    return this;
  }
}

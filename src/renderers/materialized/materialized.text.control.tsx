import { JSX } from '../JSX';
import { withIncreasedRank } from '../../core/testers';
import { Control, ControlProps, ControlState } from '../controls/Control';
import { resolveSchema } from '../../path.util';
import { ControlElement } from '../../models/uischema';
import { mapStateToControlProps, registerStartupRenderer } from '../renderer.util';
import { textControlTester } from '../controls/text.control';
import { connect, Event } from '../../common/binding';
declare let $;
export class MaterializedTextControl extends Control<ControlProps, ControlState> {

  componentDidMount() {
    const { id, uischema, schema } = this.props;
    const controlElement = uischema as ControlElement;
    const maxLength = resolveSchema(schema, controlElement.scope.$ref).maxLength;
    if (uischema.options && uischema.options.trim && maxLength !== undefined) {
      const input = $(`[id="${id}"]`);
      const fontSize = parseFloat(input.css('font-size'));

      /**
       * The widest letter of the latin alphabet is W and has a width of
       * widestLetterWidth when displayed with a font-size of baseFontSize.
       * Needed for the calculation of the input's width.
       * @type {number}
       */
      const widestLetterWidth = 15;

      /**
       * Base font size at which the letter W has a width of widestLetterWidth.
       * Needed for taking the current font-size of the input into account
       * when calculating the input's width.
       * @type {number}
       */
      const baseFontSize = 14.5;

      /*
         For the calculation of the input's width, the maximum number of allowed characters
         (maxLength) has to be multiplied by widestLetterWidth, as an input text consisting
         of W only can be assumed to be the widest input text possible.
         Furthermore, the result of this has to be multiplied by the ratio with which the
         font-size has increased (decreased) compared to the baseFontSize that applies to
         the mentioned widestLetterWidth for a W, in order to enlarge (shrink) the input
         width according to the changed font-size.
       */
      input.css('width', `${(maxLength * widestLetterWidth) * (fontSize / baseFontSize)}px`);

      // work-around of https://github.com/Dogfalo/materialize/issues/5408
      $(`[id="${id}-parent"]`).css('text-align', 'initial');
    }
  }

  render() {
    const { classNames, id, visible, enabled, errors, label, uischema, schema } = this.props;
    const controlElement = uischema as ControlElement;
    const maxLength = resolveSchema(schema, controlElement.scope.$ref).maxLength;

    return (
      <div className={classNames.wrapper} id={id + '-parent'}>
        <input value={this.state.value}
               onChange={(ev: Event<HTMLInputElement>) =>
                 this.handleChange(ev.currentTarget.value)
               }
               className={classNames.input}
               id={id}
               hidden={!visible}
               disabled={!enabled}
               autoFocus={uischema.options && uischema.options.focus}
               maxlength={uischema.options && uischema.options.restrict ? maxLength : undefined}
        />
        <label htmlFor={id} className={classNames.label} data-error={errors}>
          {label}
        </label>
      </div>
    );
  }
}

export default registerStartupRenderer(
  withIncreasedRank(1, textControlTester),
  connect(mapStateToControlProps)(MaterializedTextControl)
);

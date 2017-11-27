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
    const resolvedSchema = resolveSchema(schema, controlElement.scope.$ref);
    const maxLength = resolvedSchema ? resolvedSchema.maxLength : undefined;
    if (uischema.options && uischema.options.trim && maxLength !== undefined) {
      const fontSize = parseFloat($('[id="' + id + '"]').css('font-size'));
      $('[id="' + id + '"]').css('width', (maxLength * 15) * (fontSize / 14.5) + 'px');

      // work-around of https://github.com/Dogfalo/materialize/issues/5408
      $('[id="' + id + '-parent"]').css('text-align', 'initial');
    }
  }

  render() {
    const { classNames, id, visible, enabled, errors, label, uischema, schema } = this.props;
    const controlElement = uischema as ControlElement;
    const resolvedSchema = resolveSchema(schema, controlElement.scope.$ref);
    const maxLength = resolvedSchema ? resolvedSchema.maxLength : undefined;

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

import { JSX } from '../JSX';
import { withIncreasedRank } from '../../core/testers';
import { ControlElement } from '../../models/uischema';
import { resolveSchema } from '../../path.util';
import { connect } from 'inferno-redux';
import { update } from '../../actions';
import { Control, ControlProps } from '../controls/Control';
import { mapStateToControlProps, registerStartupRenderer } from '../renderer.util';
import { enumControlTester } from '../controls/enum.control';
declare let $;

export class EnumControl extends Control<ControlProps, void> {

  componentDidMount() {
    $('select').material_select();
  }

  componentDidUpdate() {
    $('select').material_select();
  }

  render() {
    const {
      uischema,
      schema,
      classNames,
      id,
      label,
      visible,
      enabled,
      data,
      errors
    } = this.props;
    const options = resolveSchema(
      schema,
      (uischema as ControlElement).scope.$ref
    ).enum;

    return (
      <div className={classNames.wrapper} hidden={!visible}>
        <select
          className={classNames.input}
          disabled={!enabled}
          value={data}
          onChange={ev => this.updateData(ev.target.value) }
        >
          {
            [<option value='' selected={data === undefined}/>]
              .concat(
                options.map(optionValue => {
                  return (
                    <option
                      value={optionValue}
                      label={optionValue}
                      selected={data === optionValue}
                    >
                      {optionValue}
                    </option>
                  );
                })
            )
          }
        </select>
        <label for={id} data-error={errors}>
          {label}
        </label>
      </div>
    );
  }
}

export default registerStartupRenderer(
  withIncreasedRank(1, enumControlTester),
  connect(mapStateToControlProps)(EnumControl)
);

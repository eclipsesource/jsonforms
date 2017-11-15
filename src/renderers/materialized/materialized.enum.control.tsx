import { JSX } from '../JSX';
import { withIncreasedRank } from '../../core/testers';
import { ControlElement } from '../../models/uischema';
import { resolveSchema } from '../../path.util';
import { Control, ControlProps, ControlState } from '../controls/Control';
import { mapStateToControlProps, registerStartupRenderer } from '../renderer.util';
import { enumControlTester } from '../controls/enum.control';
import { connect } from '../../common/binding';
declare let $;

export class MaterializedEnumControl extends Control<ControlProps, ControlState> {

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
      errors,
      required
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
          value={this.state.value}
          onChange={ev => this.handleChange(ev.target.value) }
        >
          {
            [<option value='' selected={data === undefined} key={'empty'}/>]
              .concat(
                options.map(optionValue => {
                  return (
                    <option
                      value={optionValue}
                      label={optionValue}
                      selected={data === optionValue}
                      key={optionValue}
                    >
                      {optionValue}
                    </option>
                  );
                })
            )
          }
        </select>
        <label htmlFor={id} data-error={errors}>
          {required && !this.state.value ? label + '*' : label}
        </label>
      </div>
    );
  }
}

export default registerStartupRenderer(
  withIncreasedRank(1, enumControlTester),
  connect(mapStateToControlProps)(MaterializedEnumControl)
);

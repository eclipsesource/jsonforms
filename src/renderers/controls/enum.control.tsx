import { JSX } from '../JSX';
import { and, RankedTester, rankWith, schemaMatches, uiTypeIs } from '../../core/testers';
import { ControlElement } from '../../models/uischema';
import { resolveSchema } from '../../path.util';
import { connect } from 'inferno-redux';
import { update } from '../../actions';
import { Control, ControlProps } from './Control';
import {
  formatErrorMessage,
  mapStateToControlProps,
  registerStartupRenderer
} from '../renderer.util';

/**
 * Default tester for enum controls.
 * @type {RankedTester}
 */
export const enumControlTester: RankedTester = rankWith(2, and(
    uiTypeIs('Control'),
    schemaMatches(schema => schema.hasOwnProperty('enum'))
  ));

export class EnumControl extends Control<ControlProps, void> {

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
      dispatch,
      path,
      errors
    } = this.props;
    const isValid = errors.length === 0;
    const options = resolveSchema(
      schema,
      (uischema as ControlElement).scope.$ref
    ).enum;
    const divClassNames = 'validation' + (isValid ? '' : ' validation_error');

    return (
      <div className={classNames.wrapper}>
        <label for={id} className={classNames.label} data-error={errors}>
          {label}
        </label>
        <select
          className={classNames.input}
          hidden={!visible}
          disabled={!enabled}
          value={data}
          onInput={ev => dispatch(update(path, () => ev.target.value)) }
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
        <div className={divClassNames}>
          {!isValid ? formatErrorMessage(errors) : ''}
        </div>
      </div>
    );
  }
}

export default registerStartupRenderer(
  enumControlTester,
  connect(mapStateToControlProps)(EnumControl)
);

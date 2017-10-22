import { JSX } from '../JSX';
import { and, RankedTester, rankWith, schemaMatches, uiTypeIs } from '../../core/testers';
import { ControlElement } from '../../models/uischema';
import { resolveSchema } from '../../path.util';
import { BaseControl, mapStateToControlProps } from './base.control';
import { connect } from 'inferno-redux';
import { update } from '../../actions';
import { ControlProps } from './Control';
import { registerStartupRenderer } from '../renderer.util';

/**
 * Default tester for enum controls.
 * @type {RankedTester}
 */
export const enumControlTester: RankedTester = rankWith(2, and(
    uiTypeIs('Control'),
    schemaMatches(schema => schema.hasOwnProperty('enum'))
  ));

export class EnumControl extends BaseControl<ControlProps, void> {

  valueProperty = 'value';

  createInputElement() {
    const { uischema, schema, visible, enabled, data, dispatch, path } = this.props;
    const isHidden = !visible;
    const isDisabled = !enabled;
    const options = resolveSchema(
      schema,
      (uischema as ControlElement).scope.$ref
    ).enum;

    return (
      <select
        hidden={isHidden}
        disabled={isDisabled}
        value={data}
        onInput={ev => {
          dispatch(update(path, () => this.getInputValue(ev.target)));
        }}
      >
        {
          [<option value=''/>].concat(
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
    );
  }

  /**
   * @inheritDoc
   */
  protected get inputChangeProperty(): string {
    return 'onchange';
  }

  /**
   * @inheritDoc
   */
  protected toInput(value: any): any {
    return (value === undefined || value === null) ? undefined : value;
  }
}

export default registerStartupRenderer(
  enumControlTester,
  connect(mapStateToControlProps)(EnumControl)
);

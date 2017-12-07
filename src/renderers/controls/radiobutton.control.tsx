import { JSX } from '../JSX';
import { and, enumLengthAtMost, RankedTester } from '../../core/testers';
import { rankWith, schemaMatches, uiTypeIs } from '../../core/testers';
import { ControlElement } from '../../models/uischema';
import { resolveSchema } from '../../path.util';
import { update } from '../../actions';
import { connect, Event } from '../../common/binding';
import { Control, ControlProps, ControlState } from './Control';
import {
    mapStateToControlProps,
    registerStartupRenderer
} from '../renderer.util';

/**
 * Default tester for radiobutton controls.
 * @type {RankedTester}
 */
export const radiobuttonControlTester: RankedTester = rankWith(2, and(
    uiTypeIs('Control'),
    schemaMatches(schema => schema.hasOwnProperty('enum')),
    enumLengthAtMost(3)
));

export class RadiobuttonControl extends Control<ControlProps, ControlState> {

    render() {
        const  { uischema, schema, classNames, id, label,
            visible, enabled, errors } = this.props;

        const options = resolveSchema(
            schema,
            (uischema as ControlElement).scope.$ref
        ).enum;

        return (
            <div className={classNames.wrapper}
                 hidden={!visible}
                 disabled={!enabled}>
                <label htmlFor={id} className={classNames.label} data-error={errors}>
                    {label}
                </label>
                {
                  options.map(optionValue => {
                      return (
                          <div>
                              <input
                                  type='radio'
                                  name={label}
                                  id={optionValue}
                                  value={optionValue}
                              />
                              <label for={optionValue}
                                  onClick={e => this.handleChange(e.target.value)}>
                                  {optionValue}
                              </label>
                          </div>
                      );
                  })
                }
            </div>
        );
    }
}

export default registerStartupRenderer(
    radiobuttonControlTester,
    connect(mapStateToControlProps)(RadiobuttonControl)
);

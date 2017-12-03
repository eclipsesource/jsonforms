import { JSX } from '../JSX';
import { mapStateToInputProps, registerStartupInput } from './field.util';
import { ControlElement } from '../../models/uischema';
import { resolveSchema } from '../../path.util';
import { connect, Event } from '../../common/binding';
import { and, RankedTester, rankWith, schemaMatches, uiTypeIs } from '../../core/testers';
import { Field, FieldProps, FieldState } from './field';

export class EnumField extends Field<FieldProps, FieldState> {
  render() {
    const { data, className, id, visible, enabled, uischema, schema } = this.props;
    const options = resolveSchema(schema, (uischema as ControlElement).scope.$ref).enum;

    return <select
        className={className}
        id={id}
        hidden={!visible}
        disabled={!enabled}
        autoFocus={uischema.options && uischema.options.focus}
        value={data || ''}
        onChange={(ev: Event<HTMLSelectElement>) => {
          console.log(ev.currentTarget.value);
          this.handleChange(ev.currentTarget.value);
        }
        }
      >
        {
          [<option value='' key={'empty'} />]
            .concat(
              options.map(optionValue =>
                  (
                    <option
                      value={optionValue}
                      label={optionValue}
                      key={optionValue}
                    >
                      {optionValue}
                    </option>
                  )
              )
          )
        }
      </select>;
  }
}
/**
 * Default tester for enum controls.
 * @type {RankedTester}
 */
export const enumFieldTester: RankedTester = rankWith(2, and(
  uiTypeIs('Control'),
  schemaMatches(schema => schema.hasOwnProperty('enum'))
));

export default registerStartupInput(
  enumFieldTester,
  connect(mapStateToInputProps)(EnumField)
);

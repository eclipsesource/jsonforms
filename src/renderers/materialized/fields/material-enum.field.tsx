import { JSX } from '../../JSX';
import { withIncreasedRank } from '../../../core/testers';
import { mapStateToInputProps, registerStartupInput } from '../../fields/field.util';
import { EnumField, enumFieldTester } from '../../fields/enum.field';
import { connect, Event } from '../../../common/binding';
import { ControlElement } from '../../../models/uischema';
import { resolveSchema } from '../../../path.util';
import { Field, FieldProps, FieldState } from '../../fields/field';
import Select from 'material-ui/Select';
import { MenuItem } from 'material-ui/Menu';

export class MaterialEnumField extends Field<FieldProps, FieldState> {
  render() {
    const { data, className, id, visible, enabled, uischema, schema } = this.props;
    const options = resolveSchema(schema, (uischema as ControlElement).scope.$ref).enum;

    return <Select
        className={className}
        id={id}
        disabled={!enabled}
        autoFocus={uischema.options && uischema.options.focus}
        value={data || ''}
        onChange={ ev => {
          this.handleChange(ev.target.value);
        }
        }
      >
        {
          [<MenuItem value='' key={'empty'} />]
            .concat(
              options.map(optionValue =>
                  (
                    <MenuItem
                      value={optionValue}
                      key={optionValue}
                    >
                      {optionValue}
                    </MenuItem>
                  )
              )
          )
        }
      </Select>;
  }
}
export default registerStartupInput(
  withIncreasedRank(1, enumFieldTester),
  connect(mapStateToInputProps)(MaterialEnumField)
);

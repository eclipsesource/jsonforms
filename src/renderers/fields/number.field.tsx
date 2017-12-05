import { JSX } from '../JSX';
import * as _ from 'lodash';
import { FieldProps, handleChange, mapStateToInputProps, registerStartupInput } from './field.util';
import { and, RankedTester, rankWith, schemaTypeIs, uiTypeIs } from '../../core/testers';
import { connect, Event } from '../../common/binding';

export const NumberField = (props: FieldProps) => {
  const { data, className, id, enabled, uischema } = props;

  return <input type='number'
       step='0.1'
       value={data || ''}
       onChange={(ev: Event<HTMLInputElement>) =>
         handleChange(props, _.toNumber(ev.currentTarget.value))
       }
       className={className}
       id={id}
       disabled={!enabled}
       autoFocus={uischema.options && uischema.options.focus}
  />;
};

/**
 * Default tester for number controls.
 * @type {RankedTester}
 */
export const numberFieldTester: RankedTester = rankWith(2, and(
  uiTypeIs('Control'),
  schemaTypeIs('number')
));

export default registerStartupInput(
  numberFieldTester,
  connect(mapStateToInputProps)(NumberField)
);

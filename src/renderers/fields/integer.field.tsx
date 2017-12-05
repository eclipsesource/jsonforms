import { JSX } from '../JSX';
import * as _ from 'lodash';
import { FieldProps, handleChange, mapStateToInputProps, registerStartupInput } from './field.util';
import { and, RankedTester, rankWith, schemaTypeIs, uiTypeIs } from '../../core/testers';
import { connect, Event } from '../../common/binding';

export const IntegerField  = (props: FieldProps) => {
  const { data, className, id, enabled, uischema } = props;

  return <input type='number'
       step='1'
       value={data || ''}
       onChange={(ev: Event<HTMLInputElement>) =>
         handleChange(props, _.toInteger(ev.currentTarget.value))
       }
       className={className}
       id={id}
       disabled={!enabled}
       autoFocus={uischema.options && uischema.options.focus}
       />;
};
/**
 * Default tester for integer controls.
 * @type {RankedTester}
 */
export const integerFieldTester: RankedTester = rankWith(2, and(
  uiTypeIs('Control'),
  schemaTypeIs('integer')
));

export default registerStartupInput(
  integerFieldTester,
  connect(mapStateToInputProps)(IntegerField)
);

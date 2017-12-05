import { JSX } from '../JSX';

import { ControlProps } from './Control';
import {
  formatErrorMessage,
  mapStateToControlProps,
  registerStartupRenderer
} from '../renderer.util';
import { connect, Event } from '../../common/binding';
import DispatchField from '../fields/dispatch.field';
import { isControl, RankedTester, rankWith } from '../../core/testers';

export const InputControl =
  ({ classNames, id, errors, label, uischema, schema, visible }: ControlProps) => {
  const isValid = errors.length === 0;
  const divClassNames = 'validation' + (isValid ? '' : ' validation_error');

  return (
    <div className={classNames.wrapper} hidden={!visible}>
      <label htmlFor={id} className={classNames.label}>
        {label}
      </label>
      <DispatchField uischema = {uischema} schema = {schema}/>
      <div className={divClassNames}>
        {!isValid ? formatErrorMessage(errors) : ''}
      </div>
    </div>
  );
};
export const inputControlTester: RankedTester = rankWith(1, isControl);
export default registerStartupRenderer(
  inputControlTester,
  connect(mapStateToControlProps)(InputControl)
);

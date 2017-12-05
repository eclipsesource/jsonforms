import { JSX } from '../JSX';

import { ControlProps } from '../controls/Control';
import {
  formatErrorMessage,
  mapStateToControlProps,
  registerStartupRenderer
} from '../renderer.util';
import { connect, Event } from '../../common/binding';
import DispatchField from '../fields/dispatch.field';
import { isControl, RankedTester, rankWith } from '../../core/testers';
import { InputLabel } from 'material-ui/Input';
import { FormControl, FormHelperText } from 'material-ui/Form';

export const MaterializedControl =
  ({ classNames, id, errors, label, uischema, schema, visible }: ControlProps) => {
  const isValid = errors.length === 0;

  return (
    <FormControl className={classNames.wrapper} hidden={!visible}>
      <InputLabel htmlFor={id} className={classNames.label}>{label}</InputLabel>
      <DispatchField uischema = {uischema} schema = {schema}/>
      <FormHelperText error={!isValid}>{errors}</FormHelperText>
    </FormControl>
  );
};

export default registerStartupRenderer(
  rankWith(2, isControl),
  connect(mapStateToControlProps)(MaterializedControl)
);

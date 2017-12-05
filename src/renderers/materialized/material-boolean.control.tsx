import { JSX } from '../JSX';
import { withIncreasedRank } from '../../core/testers';
import { ControlProps } from '../controls/Control';
import { mapStateToControlProps, registerStartupRenderer } from '../renderer.util';
import { booleanFieldTester } from '../fields/boolean.field';
import { connect, Event } from '../../common/binding';
import { FormControlLabel } from 'material-ui/Form';

import MaterialBooleanField from './fields/material-boolean.field';

export const MaterialBooleanControl =
    ({ classNames, id, errors, label, uischema, schema }: ControlProps) => {
    const isValid = errors.length === 0;

    return (
      <FormControlLabel className={classNames.wrapper} label={label}
      control={<MaterialBooleanField uischema = {uischema} schema = {schema}/>}
      />
    );
  };

export default registerStartupRenderer(
  withIncreasedRank(2, booleanFieldTester),
  connect(mapStateToControlProps)(MaterialBooleanControl)
);

import React from 'react';
import { rule } from '@jsonforms/examples';
import Demo from '../common/Demo';

const RuleExample = () => {
  return (
    <Demo schema={rule.schema} uischema={rule.uischema} data={rule.data} />
  );
};

export default RuleExample;

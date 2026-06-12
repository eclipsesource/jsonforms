import TextField from '@mui/material/TextField';
import type { NodeRendererProps } from '@jsonforms/react';
import { useControlDispatch, useControlNode } from '@jsonforms/react';

export const MaterialNumberControl = ({ id }: NodeRendererProps) => {
  const node = useControlNode(id);
  const { setValue, touch } = useControlDispatch(node);
  const hasIssues = node.issues.length > 0;
  const step =
    node.constraints.multipleOf ?? (node.valueType === 'integer' ? 1 : 'any');
  return (
    <TextField
      fullWidth
      type="number"
      label={node.label}
      value={typeof node.value === 'number' ? node.value : ''}
      required={node.required}
      disabled={node.disabled}
      error={hasIssues}
      helperText={node.issues[0]?.message ?? node.description}
      slotProps={{
        htmlInput: {
          min: node.constraints.minimum,
          max: node.constraints.maximum,
          step,
          readOnly: node.readonly,
        },
      }}
      onChange={(event) => {
        const raw = event.target.value;
        setValue(raw === '' ? undefined : Number(raw));
      }}
      onBlur={touch}
    />
  );
};

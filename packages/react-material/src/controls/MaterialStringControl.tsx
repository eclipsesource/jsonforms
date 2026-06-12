import TextField from '@mui/material/TextField';
import type { NodeRendererProps } from '@jsonforms/react';
import { useControlDispatch, useControlNode } from '@jsonforms/react';

export const MaterialStringControl = ({ id }: NodeRendererProps) => {
  const node = useControlNode(id);
  const { setValue, touch } = useControlDispatch(node);
  const multiline = node.uiOptions['multi'] === true;
  const hasIssues = node.issues.length > 0;
  return (
    <TextField
      fullWidth
      label={node.label}
      value={typeof node.value === 'string' ? node.value : ''}
      required={node.required}
      disabled={node.disabled}
      error={hasIssues}
      helperText={node.issues[0]?.message ?? node.description}
      multiline={multiline}
      minRows={multiline ? 3 : undefined}
      slotProps={{
        htmlInput: {
          maxLength: node.constraints.maxLength,
          readOnly: node.readonly,
        },
      }}
      onChange={(event) =>
        setValue(event.target.value === '' ? undefined : event.target.value)
      }
      onBlur={touch}
    />
  );
};

import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import type { NodeRendererProps } from '@jsonforms/react';
import { useControlDispatch, useControlNode } from '@jsonforms/react';

export const MaterialBooleanControl = ({ id }: NodeRendererProps) => {
  const node = useControlNode(id);
  const { setValue, touch } = useControlDispatch(node);
  const hasIssues = node.issues.length > 0;
  const helperText = node.issues[0]?.message ?? node.description;
  return (
    <FormControl
      required={node.required}
      error={hasIssues}
      disabled={node.disabled}
    >
      <FormControlLabel
        control={
          <Checkbox
            checked={node.value === true}
            onChange={(_event, checked) => setValue(checked)}
            onBlur={touch}
          />
        }
        label={node.label}
      />
      {helperText !== undefined && (
        <FormHelperText>{helperText}</FormHelperText>
      )}
    </FormControl>
  );
};

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { NodeRendererProps } from '@jsonforms/react';
import { NodeDispatch, useLayoutNode } from '@jsonforms/react';

/** Renders vertical and horizontal layouts as a MUI Stack. */
export const MaterialLayout = ({ id }: NodeRendererProps) => {
  const node = useLayoutNode(id);
  const horizontal = node.direction === 'horizontal';
  return (
    <Stack spacing={2} sx={{ width: '100%' }}>
      {node.label !== undefined && (
        <Typography variant="subtitle1">{node.label}</Typography>
      )}
      <Stack direction={horizontal ? 'row' : 'column'} spacing={2} useFlexGap>
        {node.children.map((childId) => (
          <Box
            key={childId}
            sx={horizontal ? { flex: 1, minWidth: 0 } : undefined}
          >
            <NodeDispatch id={childId} />
          </Box>
        ))}
      </Stack>
    </Stack>
  );
};

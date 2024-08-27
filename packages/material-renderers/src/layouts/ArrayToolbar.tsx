import {
  FormHelperText,
  Grid,
  IconButton,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import React from 'react';
import ValidationIcon from '../complex/ValidationIcon';
import { ArrayTranslations } from '@jsonforms/core';
export interface ArrayLayoutToolbarProps {
  label: string;
  description: string;
  errors: string;
  path: string;
  enabled: boolean;
  addItem(path: string, data: any): () => void;
  createDefault(): any;
  translations: ArrayTranslations;
  disableAdd?: boolean;
}
export const ArrayLayoutToolbar = React.memo(function ArrayLayoutToolbar({
  label,
  description,
  errors,
  addItem,
  path,
  enabled,
  createDefault,
  translations,
  disableAdd,
}: ArrayLayoutToolbarProps) {
  return (
    <Toolbar disableGutters={true}>
      <Stack>
        <Grid container alignItems='center' justifyContent='space-between'>
          <Grid item>
            <Grid
              container
              justifyContent={'flex-start'}
              alignItems={'center'}
              spacing={2}
            >
              <Grid item>
                <Typography variant={'h6'}>{label}</Typography>
              </Grid>
              <Grid item>
                {errors.length !== 0 && (
                  <Grid item>
                    <ValidationIcon
                      id='tooltip-validation'
                      errorMessages={errors}
                    />
                  </Grid>
                )}
              </Grid>
            </Grid>
          </Grid>
          {enabled && !disableAdd && (
            <Grid item>
              <Grid container>
                <Grid item>
                  <Tooltip
                    id='tooltip-add'
                    title={translations.addTooltip}
                    placement='bottom'
                  >
                    <IconButton
                      aria-label={translations.addTooltip}
                      onClick={addItem(path, createDefault())}
                      size='large'
                    >
                      <AddIcon />
                    </IconButton>
                  </Tooltip>
                </Grid>
              </Grid>
            </Grid>
          )}
        </Grid>
        {description && <FormHelperText>{description}</FormHelperText>}
      </Stack>
    </Toolbar>
  );
});

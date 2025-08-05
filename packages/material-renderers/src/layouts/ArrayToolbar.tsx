import {
  FormHelperText,
  Grid,
  IconButton,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import { Add } from '@mui/icons-material';
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
      <Stack width='100%'>
        <Grid container alignItems='center' justifyContent='space-between'>
          <Grid>
            <Grid
              container
              justifyContent={'flex-start'}
              alignItems={'center'}
              spacing={2}
            >
              <Grid>
                <Typography variant={'h6'}>{label}</Typography>
              </Grid>
              <Grid>
                {errors.length !== 0 && (
                  <Grid>
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
            <Grid>
              <Grid container>
                <Grid>
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
                      <Add />
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

/*
  The MIT License

  Copyright (c) 2018 EclipseSource Munich
  https://github.com/eclipsesource/jsonforms

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
*/
import Divider from '@material-ui/core/Divider';
import * as React from 'react';
import { ArrayControlProps, composePaths } from '@jsonforms/core';
import { JsonForms } from '@jsonforms/react';
import * as _ from 'lodash';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import { Grid, Hidden, Tooltip } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DeleteIcon from '@material-ui/icons/Delete';
import ValidationIcon from '../complex/ValidationIcon';

export const MaterialArrayLayout =
  ({
    data,
    label,
    path,
    scopedSchema,
    addItem,
    uischema,
    findUISchema,
    errors,
    removeItems
  }: ArrayControlProps) => {
    return (
      <div>
          <Toolbar>
            <Grid container alignItems='center' justify='space-between'>
              <Grid item>
                <Typography variant='h6'>{label}</Typography>
              </Grid>
              <Hidden smUp={errors.length === 0}>
                <Grid item>
                  <ValidationIcon id='tooltip-validation' errorMessages={errors}/>
                </Grid>
              </Hidden>
              <Grid item>
                <Grid container>
                  <Grid item>
                    <Tooltip id='tooltip-add' title={`Add to ${label}`} placement='bottom'>
                      <Button
                        variant='contained'
                        color='primary'
                        aria-label={`Add to ${label}`}
                        onClick={addItem(path)}
                      >
                        <AddIcon/>
                      </Button>
                    </Tooltip>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Toolbar>
          <div>
            {
              data ? _.range(0, data.length).map(index => {

                const foundUISchema = findUISchema(scopedSchema, uischema.scope, path);
                const childPath = composePaths(path, `${index}`);

                return (
                  <ExpansionPanel key={index}>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography>
                        {!data[index].name ? `${label}_${index}` : data[index].name}
                      </Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                      <JsonForms
                          schema={scopedSchema}
                          uischema={foundUISchema || uischema}
                          path={childPath}
                          key={childPath}
                      />
                    </ExpansionPanelDetails>
                    <Divider />
                    <ExpansionPanelActions>
                      <Button size='small' variant='contained'>
                        <DeleteIcon onClick={removeItems(path, [data[index]])}/>
                      </Button>
                    </ExpansionPanelActions>
                  </ExpansionPanel>
                );
              }) : <p>No data</p>
            }
          </div>
      </div>
    );
  };

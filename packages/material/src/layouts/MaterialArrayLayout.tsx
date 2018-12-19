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
import * as React from 'react';
import { ArrayControlProps, composePaths } from '@jsonforms/core';
import { JsonForms } from '@jsonforms/react';
import * as _ from 'lodash';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import { Grid, Hidden, Tooltip } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Avatar from '@material-ui/core/Avatar';
import Paper from '@material-ui/core/Paper';
import DeleteIcon from '@material-ui/icons/Delete';
import ValidationIcon from '../complex/ValidationIcon';

export const MaterialArrayLayout =
  ({
     data,
     path,
     label,
     scopedSchema,
     uischema,
     errors,
     addItem,
     findUISchema,
     removeItems
   }: ArrayControlProps) => {

    const firstPrimitiveProp = _.find(Object.keys(scopedSchema.properties), propName => {
      const prop = scopedSchema.properties[propName];
      return prop.type === 'string' ||
        prop.type === 'number' ||
        prop.type === 'integer';
    });

    return (
      <Paper style={{ padding: 10 }}>
        <Toolbar>
          <Grid container alignItems='center' justify='space-between'>
            <Grid item>
              <Typography variant={'headline'}>{label}</Typography>
            </Grid>
            <Hidden smUp={errors.length === 0}>
              <Grid item>
                <ValidationIcon id='tooltip-validation' errorMessages={errors}/>
              </Grid>
            </Hidden>
            <Grid item>
              <Grid container>
                <Grid item>
                  <Tooltip
                    id='tooltip-add'
                    title={`Add to ${label}`}
                    placement='bottom'
                  >
                    <IconButton
                      aria-label={`Add to ${label}`}
                      onClick={addItem(path)}
                    >
                      <AddIcon/>
                    </IconButton>
                  </Tooltip>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Toolbar>
        <div>
          {
            data ? _.map(data, (childData, index) => {

              const foundUISchema =
                findUISchema(scopedSchema, uischema.scope, path, undefined, uischema);
              const childPath = composePaths(path, `${index}`);
              const childLabel = childData[firstPrimitiveProp];

              return (
                <ExpansionPanel key={index}>
                  <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <Grid container alignItems={'center'}>
                      <Grid item xs={11}>
                        <Grid container alignItems={'center'}>
                          <Grid item xs={1}>
                            <Avatar aria-label='Index'>
                              {index + 1}
                            </Avatar>
                          </Grid>
                          <Grid item xs={2}>
                            {childLabel}
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={1}>
                        <Grid container justify={'flex-end'}>
                          <Grid item>
                            <IconButton
                              onClick={removeItems(path, [data[index]])}
                              style={{ float: 'right' }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                    <JsonForms
                      schema={scopedSchema}
                      uischema={foundUISchema || uischema}
                      path={childPath}
                      key={childPath}
                    />
                  </ExpansionPanelDetails>
                </ExpansionPanel>
              );
            }) : <p>No data</p>
          }
        </div>
      </Paper>
    );
  };

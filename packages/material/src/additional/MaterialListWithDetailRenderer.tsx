/*
  The MIT License

  Copyright (c) 2017-2019 EclipseSource Munich
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
import {
  and,
  ArrayLayoutProps,
  composePaths,
  computeLabel,
  createDefaultValue,
  findUISchema,
  isObjectArray,
  isPlainLabel,
  JsonSchema,
  RankedTester,
  rankWith,
  uiTypeIs
} from '@jsonforms/core';
import {
  JsonFormsDispatch,
  RefResolver,
  withJsonFormsArrayLayoutProps
} from '@jsonforms/react';
import { Grid, Hidden, List, Typography } from '@material-ui/core';
import map from 'lodash/map';
import range from 'lodash/range';
import React, { useCallback, useState } from 'react';
import { ArrayLayoutToolbar } from '../layouts/ArrayToolbar';
import ListWithDetailMasterItem from './ListWithDetailMasterItem';
import merge from 'lodash/merge';

export const MaterialListWithDetailRenderer = ({
  uischemas,
  schema,
  uischema,
  path,
  errors,
  visible,
  label,
  required,
  removeItems,
  addItem,
  data,
  renderers,
  config
}: ArrayLayoutProps) => {
  const [selectedIndex, setSelectedIndex] = useState(undefined);
  const handleRemoveItem = useCallback(
    (p: string, value: any) => () => {
      removeItems(p, [value])();
      if (selectedIndex === value) {
        setSelectedIndex(undefined);
      } else if (selectedIndex > value) {
        setSelectedIndex(selectedIndex - 1);
      }
    },
    [removeItems, setSelectedIndex]
  );
  const handleListItemClick = useCallback(
    (index: number) => () => {
      setSelectedIndex(index)
    },
    [setSelectedIndex]
  );
  const appliedUiSchemaOptions = merge({}, config, uischema.options);
  const handleCreateDefaultValue = (s: any) => () => createDefaultValue(s);

  return (
    <RefResolver schema={schema} pointer={schema.$ref}>
      {(resolvedSchema: JsonSchema) => {
        const foundUISchema = findUISchema(
          uischemas,
          resolvedSchema,
          schema.$ref || `${uischema.scope}/items`,
          path,
          undefined,
          uischema
        );
        return (
          <Hidden xsUp={!visible}>
            <ArrayLayoutToolbar
              label={computeLabel(
                isPlainLabel(label) ? label : label.default,
                required,
                appliedUiSchemaOptions.hideRequiredAsterisk
              )}
              errors={errors}
              path={path}
              addItem={addItem}
              createDefault={handleCreateDefaultValue(resolvedSchema)}
            />
            <Grid container direction='row' spacing={2}>
              <Grid item xs={3}>
                <List>
                  {data > 0 ? (
                    map(range(data), index => (
                      <ListWithDetailMasterItem
                        index={index}
                        path={path}
                        schema={resolvedSchema}
                        handleSelect={handleListItemClick}
                        removeItem={handleRemoveItem}
                        selected={selectedIndex === index}
                        key={index}
                      />
                    ))
                  ) : (
                      <p>No data</p>
                    )}
                </List>
              </Grid>
              <Grid item xs>
                {selectedIndex !== undefined ? (
                  <JsonFormsDispatch
                    renderers={renderers}
                    visible={visible}
                    schema={resolvedSchema}
                    uischema={foundUISchema}
                    path={composePaths(path, `${selectedIndex}`)}
                  />
                ) : (
                    <Typography variant='h6'>No Selection</Typography>
                  )}
              </Grid>
            </Grid>
          </Hidden>
        );
      }}
    </RefResolver>
  );
};

export const materialListWithDetailTester: RankedTester = rankWith(
  4,
  and(uiTypeIs('ListWithDetail'), isObjectArray)
);

export default withJsonFormsArrayLayoutProps(MaterialListWithDetailRenderer);

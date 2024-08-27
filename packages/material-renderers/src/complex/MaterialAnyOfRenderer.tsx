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
import React, { useCallback, useState } from 'react';

import {
  CombinatorRendererProps,
  createCombinatorRenderInfos,
  createDefaultValue,
  isAnyOfControl,
  JsonSchema,
  RankedTester,
  rankWith,
} from '@jsonforms/core';
import { JsonFormsDispatch, withJsonFormsAnyOfProps } from '@jsonforms/react';
import { Tab, Tabs } from '@mui/material';
import CombinatorProperties from './CombinatorProperties';
import isEmpty from 'lodash/isEmpty';
import { TabSwitchConfirmDialog } from './TabSwitchConfirmDialog';

export const MaterialAnyOfRenderer = ({
  handleChange,
  schema,
  rootSchema,
  indexOfFittingSchema,
  visible,
  path,
  renderers,
  cells,
  uischema,
  uischemas,
  id,
  data,
}: CombinatorRendererProps) => {
  const [selectedAnyOf, setSelectedAnyOf] = useState(indexOfFittingSchema || 0);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [newSelectedIndex, setNewSelectedIndex] = useState(0);

  const handleClose = useCallback(
    () => setConfirmDialogOpen(false),
    [setConfirmDialogOpen]
  );

  const handleTabChange = useCallback(
    (_event: any, newIndex: number) => {
      if (
        isEmpty(data) ||
        typeof data ===
          typeof createDefaultValue(
            anyOfRenderInfos[newIndex].schema,
            rootSchema
          )
      ) {
        setSelectedAnyOf(newIndex);
      } else {
        setNewSelectedIndex(newIndex);
        setConfirmDialogOpen(true);
      }
    },
    [setConfirmDialogOpen, setSelectedAnyOf, data]
  );

  const openNewTab = (newIndex: number) => {
    handleChange(
      path,
      createDefaultValue(anyOfRenderInfos[newIndex].schema, rootSchema)
    );
    setSelectedAnyOf(newIndex);
  };

  const confirm = useCallback(() => {
    openNewTab(newSelectedIndex);
    setConfirmDialogOpen(false);
  }, [handleChange, createDefaultValue, newSelectedIndex]);

  const anyOf = 'anyOf';
  const anyOfRenderInfos = createCombinatorRenderInfos(
    (schema as JsonSchema).anyOf,
    rootSchema,
    anyOf,
    uischema,
    path,
    uischemas
  );

  if (!visible) {
    return null;
  }

  return (
    <>
      <CombinatorProperties
        schema={schema}
        combinatorKeyword={anyOf}
        path={path}
        rootSchema={rootSchema}
      />
      <Tabs value={selectedAnyOf} onChange={handleTabChange}>
        {anyOfRenderInfos.map((anyOfRenderInfo) => (
          <Tab key={anyOfRenderInfo.label} label={anyOfRenderInfo.label} />
        ))}
      </Tabs>
      {anyOfRenderInfos.map(
        (anyOfRenderInfo, anyOfIndex) =>
          selectedAnyOf === anyOfIndex && (
            <JsonFormsDispatch
              key={anyOfIndex}
              schema={anyOfRenderInfo.schema}
              uischema={anyOfRenderInfo.uischema}
              path={path}
              renderers={renderers}
              cells={cells}
            />
          )
      )}
      <TabSwitchConfirmDialog
        cancel={handleClose}
        confirm={confirm}
        id={'anyOf-' + id}
        open={confirmDialogOpen}
        handleClose={handleClose}
      />
    </>
  );
};

export const materialAnyOfControlTester: RankedTester = rankWith(
  3,
  isAnyOfControl
);

export default withJsonFormsAnyOfProps(MaterialAnyOfRenderer);

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

import React from 'react';
import fpfilter from 'lodash/fp/filter';
import fpmap from 'lodash/fp/map';
import fpflow from 'lodash/fp/flow';
import filter from 'lodash/filter';
import join from 'lodash/join';
import fpkeys from 'lodash/fp/keys';
import fpstartCase from 'lodash/fp/startCase';
import {
  ArrayControlProps,
  ControlElement,
  createDefaultValue,
  Paths,
  RankedTester,
  Resolve,
  Test,
  getControlPath,
  encode,
  ArrayTranslations,
} from '@jsonforms/core';
import {
  DispatchCell,
  withArrayTranslationProps,
  withJsonFormsArrayControlProps,
  withTranslateProps,
} from '@jsonforms/react';
import { Button } from '../shadcn/components/ui/button';
import { Label } from '../shadcn/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../shadcn/components/ui/table';
import { Trash2, Plus } from 'lucide-react';

const { or, isObjectArrayControl, isPrimitiveArrayControl, rankWith } = Test;

/**
 * Tester for table array control.
 */
export const tableArrayControlTester: RankedTester = rankWith(
  3,
  or(isObjectArrayControl, isPrimitiveArrayControl)
);

class TableArrayControlComponent extends React.Component<
  ArrayControlProps & { translations: ArrayTranslations },
  Record<string, never>
> {
  confirmDelete = (path: string, index: number) => {
    const p = path.substring(0, path.lastIndexOf('.'));
    this.props.removeItems(p, [index])();
  };

  render() {
    const {
      addItem,
      schema,
      rootSchema,
      path,
      data,
      visible,
      errors,
      label,
      childErrors,
      translations,
      enabled,
    } = this.props;

    const createControlElement = (key?: string): ControlElement => ({
      type: 'Control',
      label: false,
      scope: schema.type === 'object' ? `#/properties/${key}` : '#',
    });

    const isValid = errors.length === 0;

    if (!visible) {
      return null;
    }

    return (
      <div className='space-y-4'>
        <div className='flex items-center justify-between'>
          <Label className='text-base font-medium'>{label}</Label>
          <Button
            type='button'
            variant='outline'
            size='sm'
            disabled={!enabled}
            onClick={addItem(path, createDefaultValue(schema, rootSchema))}
          >
            <Plus className='h-4 w-4 mr-2' />
            {translations.addTooltip}
          </Button>
        </div>
        {!isValid && <div className='text-sm text-destructive'>{errors}</div>}
        <div className='rounded-md border'>
          <Table>
            <TableHeader>
              <TableRow>
                {schema.properties ? (
                  fpflow(
                    fpkeys,
                    fpfilter(
                      (prop) => schema.properties[prop].type !== 'array'
                    ),
                    fpmap((prop) => (
                      <TableHead key={prop}>
                        {schema.properties[prop].title ?? fpstartCase(prop)}
                      </TableHead>
                    ))
                  )(schema.properties)
                ) : (
                  <TableHead>Items</TableHead>
                )}
                <TableHead>Valid</TableHead>
                <TableHead className='w-[80px]'></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!data || !Array.isArray(data) || data.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={100}
                    className='text-center text-muted-foreground'
                  >
                    {translations.noDataMessage}
                  </TableCell>
                </TableRow>
              ) : (
                data.map((_child, index) => {
                  const childPath = Paths.compose(path, `${index}`);
                  const errorsPerEntry: any[] = filter(childErrors, (error) => {
                    const errorPath = getControlPath(error);
                    return errorPath.startsWith(childPath);
                  });

                  return (
                    <TableRow key={childPath}>
                      {schema.properties ? (
                        fpflow(
                          fpkeys,
                          fpfilter(
                            (prop) => schema.properties[prop].type !== 'array'
                          ),
                          fpmap((prop) => {
                            const childPropPath = Paths.compose(
                              childPath,
                              prop.toString()
                            );
                            return (
                              <TableCell key={childPropPath}>
                                <DispatchCell
                                  schema={Resolve.schema(
                                    schema,
                                    `#/properties/${encode(prop)}`,
                                    rootSchema
                                  )}
                                  uischema={createControlElement(encode(prop))}
                                  path={childPath + '.' + prop}
                                />
                              </TableCell>
                            );
                          })
                        )(schema.properties)
                      ) : (
                        <TableCell
                          key={Paths.compose(childPath, index.toString())}
                        >
                          <DispatchCell
                            schema={schema}
                            uischema={createControlElement()}
                            path={childPath}
                          />
                        </TableCell>
                      )}
                      <TableCell>
                        {errorsPerEntry && errorsPerEntry.length > 0 ? (
                          <span className='text-sm text-destructive'>
                            {join(
                              errorsPerEntry.map((e) => e.message),
                              ' and '
                            )}
                          </span>
                        ) : (
                          <span className='text-sm text-muted-foreground'>
                            OK
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          type='button'
                          variant='ghost'
                          size='icon'
                          disabled={!enabled}
                          aria-label={translations.removeAriaLabel}
                          onClick={() => {
                            if (
                              window.confirm(translations.deleteDialogMessage)
                            ) {
                              this.confirmDelete(childPath, index);
                            }
                          }}
                        >
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }
}

export const TableArrayControl = withJsonFormsArrayControlProps(
  withTranslateProps(withArrayTranslationProps(TableArrayControlComponent))
);

export default TableArrayControl;

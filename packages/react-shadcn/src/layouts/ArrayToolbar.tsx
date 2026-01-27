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

import type { ArrayTranslations } from '@jsonforms/core';
import { Plus } from 'lucide-react';
import React from 'react';
import { Button } from '../shadcn/components/ui/button';

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
    <div className='space-y-2'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <h3 className='text-lg font-semibold'>{label}</h3>
          {errors && errors.length !== 0 && (
            <span className='text-sm text-destructive'>{errors}</span>
          )}
        </div>
        {enabled && !disableAdd && (
          <Button
            variant='outline'
            size='sm'
            onClick={addItem(path, createDefault())}
            title={translations.addTooltip}
            aria-label={translations.addTooltip}
          >
            <Plus className='h-4 w-4 mr-2' />
            {translations.addTooltip}
          </Button>
        )}
      </div>
      {description && (
        <p className='text-sm text-muted-foreground'>{description}</p>
      )}
    </div>
  );
});

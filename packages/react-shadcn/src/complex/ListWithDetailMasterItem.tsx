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

import type { StatePropsOfMasterItem } from '@jsonforms/core';
import { withJsonFormsMasterListItemProps } from '@jsonforms/react';
import { Trash2 } from 'lucide-react';
import React from 'react';
import { Button } from '../shadcn/components/ui/button';
import { cn } from '../shadcn/lib/utils';

export const ListWithDetailMasterItem = ({
  index,
  childLabel,
  selected,
  enabled,
  handleSelect,
  removeItem,
  path,
  translations,
  disableRemove,
}: StatePropsOfMasterItem) => {
  return (
    <div
      className={cn(
        'flex items-center gap-3 p-3 border-b last:border-b-0 cursor-pointer hover:bg-muted/50 transition-colors',
        selected && 'bg-muted'
      )}
      onClick={handleSelect(index)}
    >
      <div className='flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-medium shrink-0'>
        {index + 1}
      </div>
      <div className='flex-1 min-w-0'>
        <p className='text-sm truncate'>{childLabel || `Item ${index + 1}`}</p>
      </div>
      {enabled && !disableRemove && (
        <Button
          variant='ghost'
          size='sm'
          onClick={(e) => {
            e.stopPropagation();
            removeItem(path, index)();
          }}
          title={translations.removeTooltip}
          aria-label={translations.removeAriaLabel}
          className='shrink-0 h-8 w-8 p-0'
        >
          <Trash2 className='h-4 w-4' />
        </Button>
      )}
    </div>
  );
};

export default withJsonFormsMasterListItemProps(ListWithDetailMasterItem);

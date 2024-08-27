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

import { Injectable } from '@angular/core';
import { NativeDateAdapter } from '@angular/material/core';
import { defaultDateFormat } from '@jsonforms/core';
import dayjs from 'dayjs';
import customParsing from 'dayjs/plugin/customParseFormat';

// allows to parse date strings with custom format
dayjs.extend(customParsing);

/**
 * date adapter for dayjs to parse and format dates
 */
@Injectable()
export class DayJsDateAdapter extends NativeDateAdapter {
  saveFormat: string = defaultDateFormat;

  setSaveFormat(format: string) {
    this.saveFormat = format;
  }

  /**
   * parses a given data prop string in the save-format into a date object
   * @param value date string to be parsed
   * @returns date object or null if parsing failed
   */
  parseSaveFormat(value: string): Date | null {
    return this.parse(value, this.saveFormat);
  }

  parse(value: string, format: string): Date | null {
    if (!value) {
      return null;
    }
    const date = dayjs(value, format);

    if (date.isValid()) {
      return date.toDate();
    } else {
      return null;
    }
  }

  toSaveFormat(value: Date) {
    if (!value) {
      return undefined;
    }
    const date = dayjs(value);
    if (date.isValid()) {
      return date.format(this.saveFormat);
    } else {
      return undefined;
    }
  }

  /**
   * transforms the date to a string representation for display
   * @param date date to be formatted
   * @param displayFormat format to be used for formatting the date e.g. YYYY-MM-DD
   * @returns string representation of the date
   */
  format(date: Date, displayFormat: string): string {
    return dayjs(date).format(displayFormat);
  }

  deserialize(value: any): Date | null {
    if (!value) {
      return null;
    }
    const date = dayjs(value);
    if (date.isValid()) {
      return date.toDate();
    } else {
      return null;
    }
  }
}

/*
  The MIT License

  Copyright (c) 2024-2024 EclipseSource Munich
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
import dayjs from 'dayjs';
import { formatDate } from '../src/util/datejs';

describe('Date Util tester', () => {
  test('format default', () => {
    const date = dayjs('2024-01-01');
    const actual = formatDate(date, 'YYYY-MM-DD');
    expect(actual).toBe('2024-01-01');
  });

  test('format year < 1000', () => {
    const date = dayjs('999-01-01');
    const actual = formatDate(date, 'YYYY-MM-DD');
    expect(actual).toBe('0999-01-01');
  });

  test('format 100 < year < 1000', () => {
    const date = dayjs(new Date('0099-01-01'));
    const actual = formatDate(date, 'YYYY-MM-DD');
    expect(actual).toBe('0099-01-01');
  });

  test('format 10 < year < 100', () => {
    const date = dayjs(new Date('0019-01-01'));
    const actual = formatDate(date, 'YYYY-MM-DD');
    expect(actual).toBe('0019-01-01');
  });
});

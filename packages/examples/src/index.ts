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
import * as allOf from './allOf';
import * as anyOf from './anyOf';
import * as oneOf from './oneOf';
import * as oneOfArray from './oneOfArray';
import * as array from './arrays';
import * as nestedArray from './nestedArrays';
import * as arrayWithDetail from './arrays-with-detail';
import * as arrayWithDetailAndRule from './arrays-with-detail-and-rule';
import * as arrayWithCustomChildLabel from './arrays-with-custom-element-label';
import * as stringArray from './stringArray';
import * as categorization from './categorization';
import * as stepper from './stepper';
import * as day1 from './day1';
import * as day2 from './day2';
import * as day3 from './day3';
import * as day4 from './day4';
import * as day5 from './day5';
import * as day6 from './day6';
import * as dates from './dates';
import * as dyanmic from './dynamic';
import * as generateSchema from './generate';
import * as generateUISchema from './generateUI';
import * as layout from './layout';
import * as person from './person';
import * as rule from './rule';
import * as ruleInheritance from './ruleInheritance';
import * as resolve from './resolve';
import * as config from './config';
import * as text from './text';
import * as numbers from './numbers';
import * as scope from './scope';
import * as listWithDetail from './list-with-detail';
import * as listWithDetailRegistered from './list-with-detail-registered';
import * as object from './object';
import * as i18n from './i18n';
import * as issue_1169 from './1169';
import * as issue_1220 from './1220';
import * as issue_1253 from './1253';
import * as issue_1254 from './1254';
import * as oneOfRecursive from './oneOf-recursive';
import * as huge from './huge';
import * as defaultExample from './default';
import * as onChange from './onChange';
export * from './register';
export * from './example';

import * as ifThenElse from './if_then_else';

export {
  defaultExample,
  allOf,
  anyOf,
  oneOf,
  oneOfArray,
  stringArray,
  array,
  nestedArray,
  arrayWithDetail,
  arrayWithDetailAndRule,
  arrayWithCustomChildLabel,
  categorization,
  stepper,
  day1,
  day2,
  day3,
  day4,
  day5,
  day6,
  generateSchema,
  generateUISchema,
  layout,
  person,
  rule,
  ruleInheritance,
  dates,
  dyanmic,
  resolve,
  config,
  text,
  numbers,
  scope,
  listWithDetail,
  listWithDetailRegistered,
  object,
  i18n,
  issue_1169,
  issue_1220,
  issue_1253,
  issue_1254,
  oneOfRecursive,
  huge,
  ifThenElse,
  onChange
};

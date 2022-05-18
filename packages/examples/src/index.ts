/*
  The MIT License

  Copyright (c) 2017-2021 EclipseSource Munich
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
import * as allOf from './examples/allOf';
import * as anyOf from './examples/anyOf';
import * as oneOf from './examples/oneOf';
import * as oneOfArray from './examples/oneOfArray';
import * as anyOfOneOfAllOfResolve from './examples/anyOf-oneOf-allOf-resolve';
import * as array from './examples/arrays';
import * as nestedArray from './examples/nestedArrays';
import * as arrayWithDetail from './examples/arrays-with-detail';
import * as arrayWithDetailAndRule from './examples/arrays-with-detail-and-rule';
import * as arrayWithCustomChildLabel from './examples/arrays-with-custom-element-label';
import * as stringArray from './examples/stringArray';
import * as categorization from './examples/categorization';
import * as stepper from './examples/stepper';
import * as steppershownav from './examples/steppershownav';
import * as controlOptions from './examples/control-options';
import * as day1 from './examples/day1';
import * as day2 from './examples/day2';
import * as day3 from './examples/day3';
import * as day4 from './examples/day4';
import * as day5 from './examples/day5';
import * as day6 from './examples/day6';
import * as dates from './examples/dates';
import * as dynamic from './examples/dynamic';
import * as generateSchema from './examples/generate';
import * as generateUISchema from './examples/generateUI';
import * as layout from './examples/layout';
import * as person from './examples/person';
import * as rule from './examples/rule';
import * as ruleInheritance from './examples/ruleInheritance';
import * as config from './examples/config';
import * as text from './examples/text';
import * as numbers from './examples/numbers';
import * as scope from './examples/scope';
import * as listWithDetail from './examples/list-with-detail';
import * as listWithDetailRegistered from './examples/list-with-detail-registered';
import * as object from './examples/object';
import * as i18n from './examples/i18n';
import * as issue_1169 from './examples/1169';
import * as issue_1220 from './examples/1220';
import * as issue_1253 from './examples/1253';
import * as issue_1254 from './examples/1254';
import * as oneOfRecursive from './examples/oneOf-recursive';
import * as huge from './examples/huge';
import * as defaultExample from './examples/default';
import * as onChange from './examples/onChange';
import * as enumExample from './examples/enum';
import * as radioGroupExample from './examples/radioGroup';
import * as booleanToggle from './examples/booleanToggle';
import * as multiEnum from './examples/multi-enum';
import * as enumInArray from './examples/enumInArray';
import * as readonly from './examples/readonly';
import * as bug_1779 from './examples/1779';
import * as bug_1645 from './examples/1645';
import * as conditionalSchemaComposition from './examples/conditional-schema-compositions';
export * from './register';
export * from './example';

import * as ifThenElse from './examples/if_then_else';

export {
  defaultExample,
  allOf,
  anyOf,
  oneOf,
  oneOfArray,
  anyOfOneOfAllOfResolve,
  stringArray,
  array,
  nestedArray,
  arrayWithDetail,
  arrayWithDetailAndRule,
  arrayWithCustomChildLabel,
  categorization,
  stepper,
  steppershownav,
  controlOptions,
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
  dynamic,
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
  onChange,
  enumExample,
  radioGroupExample,
  booleanToggle,
  multiEnum,
  enumInArray,
  readonly,
  bug_1779,
  bug_1645,
  conditionalSchemaComposition
};

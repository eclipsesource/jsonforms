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
import * as arrayI18n from './examples/arraysI18n';
import * as nestedArray from './examples/nestedArrays';
import * as nestedCategorization from './examples/nestedCategorization';
import * as arrayWithDetail from './examples/arrays-with-detail';
import * as arrayWithDetailAndRule from './examples/arrays-with-detail-and-rule';
import * as arrayWithCustomChildLabel from './examples/arrays-with-custom-element-label';
import * as arrayWithSorting from './examples/arrays-with-sorting';
import * as arrayWithTranslatedCustomChildLabel from './examples/arrays-with-translated-custom-element-label';
import * as arrayWithDefaults from './examples/arrays-with-defaults';
import * as stringArray from './examples/stringArray';
import * as categorization from './examples/categorization';
import * as stepper from './examples/categorization-stepper';
import * as steppershownav from './examples/categorization-stepper-nav-buttons';
import * as controlOptions from './examples/control-options';
import * as dates from './examples/dates';
import * as generateDynamic from './examples/generate-dynamic';
import * as generateSchema from './examples/generate';
import * as generateUISchema from './examples/generateUI';
import * as layout from './examples/layout';
import * as person from './examples/person';
import * as issue_1884 from './examples/1884';
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
import * as issue_1948 from './examples/1948';
import * as oneOfRecursive from './examples/oneOf-recursive';
import * as huge from './examples/huge';
import * as defaultExample from './examples/default';
import * as onChange from './examples/onChange';
import * as enumExample from './examples/enum';
import * as radioGroupExample from './examples/radioGroup';
import * as multiEnum from './examples/enum-multi';
import * as enumInArray from './examples/enumInArray';
import * as readonly from './examples/readonly';
import * as listWithDetailPrimitives from './examples/list-with-detail-primitives';
import * as conditionalSchemaComposition from './examples/conditional-schema-compositions';
import * as additionalErrors from './examples/additional-errors';
import * as multiEnumWithLabelAndDesc from './examples/enum-multi-with-label-and-desc';
import * as additionalProperties from './examples/additional-properties';
import * as login from './examples/login';
import * as string from './examples/string';
export * from './register';
export * from './example';

import * as ifThenElse from './examples/if_then_else';

export {
  issue_1948,
  defaultExample,
  allOf,
  anyOf,
  oneOf,
  oneOfArray,
  anyOfOneOfAllOfResolve,
  stringArray,
  array,
  arrayI18n,
  nestedArray,
  nestedCategorization,
  arrayWithDetail,
  arrayWithDetailAndRule,
  arrayWithCustomChildLabel,
  arrayWithSorting,
  arrayWithTranslatedCustomChildLabel,
  categorization,
  stepper,
  steppershownav,
  controlOptions,
  generateSchema,
  generateUISchema,
  layout,
  person,
  rule,
  ruleInheritance,
  dates,
  generateDynamic,
  config,
  text,
  numbers,
  scope,
  listWithDetail,
  listWithDetailRegistered,
  object,
  i18n,
  oneOfRecursive,
  huge,
  ifThenElse,
  onChange,
  enumExample,
  radioGroupExample,
  multiEnum,
  multiEnumWithLabelAndDesc,
  enumInArray,
  readonly,
  listWithDetailPrimitives,
  conditionalSchemaComposition,
  additionalErrors,
  additionalProperties,
  login,
  issue_1884,
  arrayWithDefaults,
  string,
};

import { input as allOf } from './allOf';
import { input as anyOf } from './anyOf';
import { input as anyOfSimple } from './anyOf-simple';
import { input as array } from './array';
import { input as arrayRestrict } from './array-restrict';
import { input as arrayWithReorder } from './array-with-reorder';
import { input as basic } from './basic';
import { input as categorization } from './categorization';
import { input as categorizationStepper } from './categorization-stepper';
import { input as categorizationStepperNav } from './categorization-stepper-nav';
import { input as control } from './control';
import { input as controlOptions } from './control-options';
import { input as enumExample } from './enum';
import { input as enumInArray } from './enum-in-array';
import { input as groupLayout } from './group-layout';
import { input as horizontalLayout } from './horizontal-layout';
import { input as listWithDetails } from './list-with-details';
import { input as listWithDetailsAndReorder } from './list-with-details-and-reorder';
import { input as listWithDetailsRestrict } from './list-with-details-restrict';
import { input as login } from './login';
import { input as main } from './main';
import { input as multiEnum } from './multi-enum';
import { input as nestedArray } from './nested-array';
import { input as nestedArrayRestrict } from './nested-array-restrict';
import { input as nestedArrayWithReorder } from './nested-array-with-reorder';
import { input as nestedLayout } from './nested-layout';
import { input as noSchemas } from './no-schemas';
import { input as noUISchema } from './no-ui-schema';
import { input as object } from './object';
import { input as oneOf } from './oneOf';
import { input as oneOfRecursive } from './oneOf-recursive';
import { input as radio } from './radio';
import { input as radioGroup } from './radio-group';
import { input as rootObject } from './root-object';
import { input as rule } from './rule';
import { input as verticalLayout } from './vertical-layout';
import { input as huge } from './huge';
import { input as ifThenElse } from './if-then-else';

export const examples = [
  {
    id: 'main',
    title: 'Main',
    input: main,
  },
  {
    id: 'basic',
    title: 'Basic',
    input: basic,
  },
  {
    id: 'control',
    title: 'Control',
    input: control,
  },
  {
    id: 'control-options',
    title: 'Control Options',
    input: controlOptions,
  },
  {
    id: 'enum',
    title: 'Enum',
    input: enumExample,
  },
  {
    id: 'enum-in-array',
    title: 'Enum In Array',
    input: enumInArray,
  },
  {
    id: 'multi-array',
    title: 'Multi Enum',
    input: multiEnum,
  },
  {
    id: 'categorization',
    title: 'Categorization',
    input: categorization,
  },
  {
    id: 'categorization-stepper',
    title: 'Categorization Stepper',
    input: categorizationStepper,
  },
  {
    id: 'categorization-stepper-nav',
    title: 'Categorization Stepper With Navigation',
    input: categorizationStepperNav,
  },
  {
    id: 'horizontal-layout',
    title: 'Horizontal Layout',
    input: horizontalLayout,
  },
  {
    id: 'vertical-layout',
    title: 'Vertical Layout',
    input: verticalLayout,
  },
  {
    id: 'group-layout',
    title: 'Group Layout',
    input: groupLayout,
  },
  {
    id: 'nested-layout',
    title: 'Nested Layout',
    input: nestedLayout,
  },
  {
    id: 'array',
    title: 'Array',
    input: array,
  },
  {
    id: 'array-restrict',
    title: 'Array Min/Max Items',
    input: arrayRestrict,
  },
  {
    id: 'array-with-reorder',
    title: 'Array With Reorder',
    input: arrayWithReorder,
  },
  {
    id: 'nested-array',
    title: 'Nested Array',
    input: nestedArray,
  },
  {
    id: 'nested-array-restrict',
    title: 'Nested Array Min/Max Items',
    input: nestedArrayRestrict,
  },
  {
    id: 'nested-array-with-reorder',
    title: 'Nested Array With Reorder',
    input: nestedArrayWithReorder,
  },
  {
    id: 'rule',
    title: 'Rule',
    input: rule,
  },
  {
    id: 'login',
    title: 'Login',
    input: login,
  },
  {
    id: 'radio',
    title: 'Radio',
    input: radio,
  },
  {
    id: 'radio-group',
    title: 'Radio Group',
    input: radioGroup,
  },
  {
    id: 'object',
    title: 'Object',
    input: object,
  },
  {
    id: 'root-object',
    title: 'Root Object',
    input: rootObject,
  },
  {
    id: 'no-ui-schema',
    title: 'Generate UI Schema',
    input: noUISchema,
  },
  {
    id: 'no-schemas',
    title: 'Generate Both Schemas',
    input: noSchemas,
  },
  {
    id: 'one-of',
    title: 'Combinators oneOf',
    input: oneOf,
  },
  {
    id: 'one-of-recursive',
    title: 'Combinators oneOf recursive',
    input: oneOfRecursive,
  },
  {
    id: 'any-of',
    title: 'Combinators anyOf',
    input: anyOf,
  },
  {
    id: 'any-of-simple',
    title: 'Combinators anyOf simple',
    input: anyOfSimple,
  },
  {
    id: 'all-of',
    title: 'Combinators allOf',
    input: allOf,
  },
  {
    id: 'list-with-details',
    title: 'List With Details',
    input: listWithDetails,
  },
  {
    id: 'list-with-details-restrict',
    title: 'List With Details Min/Max Items',
    input: listWithDetailsRestrict,
  },
  {
    id: 'list-with-details-reorder',
    title: 'List With Details And Reorder',
    input: listWithDetailsAndReorder,
  },
  {
    id: 'if-then-else',
    title: 'If Then Else',
    input: ifThenElse,
  },
  {
    id: 'huge',
    title: 'Huge',
    input: huge,
  },
];

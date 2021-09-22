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
    title: 'Main',
    input: main,
  },
  {
    title: 'Basic',
    input: basic,
  },
  {
    title: 'Control',
    input: control,
  },
  {
    title: 'Control Options',
    input: controlOptions,
  },
  {
    title: 'Enum',
    input: enumExample,
  },
  {
    title: 'Enum In Array',
    input: enumInArray,
  },
  {
    title: 'Multi Enum',
    input: multiEnum,
  },
  {
    title: 'Categorization',
    input: categorization,
  },
  {
    title: 'Categorization Stepper',
    input: categorizationStepper,
  },
  {
    title: 'Categorization Stepper With Navigation',
    input: categorizationStepperNav,
  },
  {
    title: 'Horizontal Layout',
    input: horizontalLayout,
  },
  {
    title: 'Vertical Layout',
    input: verticalLayout,
  },
  {
    title: 'Group Layout',
    input: groupLayout,
  },
  {
    title: 'Nested Layout',
    input: nestedLayout,
  },
  {
    title: 'Array',
    input: array,
  },
  {
    title: 'Array Min/Max Items',
    input: arrayRestrict,
  },
  {
    title: 'Array With Reorder',
    input: arrayWithReorder,
  },
  {
    title: 'Nested Array',
    input: nestedArray,
  },
  {
    title: 'Nested Array Min/Max Items',
    input: nestedArrayRestrict,
  },
  {
    title: 'Nested Array With Reorder',
    input: nestedArrayWithReorder,
  },
  {
    title: 'Rule',
    input: rule,
  },
  {
    title: 'Login',
    input: login,
  },
  {
    title: 'Radio',
    input: radio,
  },
  {
    title: 'Radio Group',
    input: radioGroup,
  },
  {
    title: 'Object',
    input: object,
  },
  {
    title: 'Root Object',
    input: rootObject,
  },
  {
    title: 'Generate UI Schema',
    input: noUISchema,
  },
  {
    title: 'Generate Both Schemas',
    input: noSchemas,
  },
  {
    title: 'Combinators oneOf',
    input: oneOf,
  },
  {
    title: 'Combinators oneOf recursive',
    input: oneOfRecursive,
  },
  {
    title: 'Combinators anyOf',
    input: anyOf,
  },
  {
    title: 'Combinators anyOf simple',
    input: anyOfSimple,
  },
  {
    title: 'Combinators allOf',
    input: allOf,
  },
  {
    title: 'List With Details',
    input: listWithDetails,
  },
  {
    title: 'List With Details Min/Max Items',
    input: listWithDetailsRestrict,
  },
  {
    title: 'List With Details And Reorder',
    input: listWithDetailsAndReorder,
  },
  {
    title: 'If Then Else',
    input: ifThenElse,
  },
  //TODO: Temporary disable the Huge example since it does generate errors and the browser hangs
  /*
  {
    title: 'Huge',
    input: huge,
  },
  */
];

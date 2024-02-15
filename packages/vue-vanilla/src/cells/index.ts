import { type JsonFormsCellRendererRegistryEntry } from '@jsonforms/core';
import TextCell from './TextCell.vue';
import NumberCell from './NumberCell.vue';
import IntegerCell from './IntegerCell.vue';
import DateCell from './DateCell.vue';
import TimeCell from './TimeCell.vue';
import DateTimeCell from './DateTimeCell.vue';
import TextareaCell from './TextareaCell.vue';
import EnumCell from './EnumCell.vue';
import EnumOneOfCell from './EnumOneOfCell.vue';
import BooleanCell from './BooleanCell.vue';

export const vanillaCells: JsonFormsCellRendererRegistryEntry[] = [
  { cell: TextCell, tester: TextCell.tester },
  { cell: NumberCell, tester: NumberCell.tester },
  { cell: IntegerCell, tester: IntegerCell.tester },
  { cell: DateCell, tester: DateCell.tester },
  { cell: TimeCell, tester: TimeCell.tester },
  { cell: DateTimeCell, tester: DateTimeCell.tester },
  { cell: TextareaCell, tester: TextareaCell.tester },
  { cell: EnumCell, tester: EnumCell.tester },
  { cell: EnumOneOfCell, tester: EnumOneOfCell.tester },
  { cell: BooleanCell, tester: BooleanCell.tester },
];

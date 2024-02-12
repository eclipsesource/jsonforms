import { type JsonFormsCellRendererRegistryEntry } from '@jsonforms/core';
import TextCell from './TextCell.vue';
import NumberCell from './NumberCell.vue';
import IntegerCell from './IntegerCell.vue';

export const vanillaCells: JsonFormsCellRendererRegistryEntry[] = [
  { cell: TextCell, tester: TextCell.tester },
  { cell: NumberCell, tester: NumberCell.tester },
  { cell: IntegerCell, tester: IntegerCell.tester },
];

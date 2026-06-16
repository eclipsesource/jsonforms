import type { ComponentPublicInstance, FunctionalComponent } from 'vue';

export type JSXComponent<Props = any> =
  | { new (): ComponentPublicInstance<Props> }
  | FunctionalComponent<Props>;
export type IconValue =
  | string
  | (string | [path: string, opacity: number])[]
  | JSXComponent;

export interface IconAliases {
  itemAdd: IconValue;
  itemCancel: IconValue;
  itemConfirm: IconValue;
  itemEdit: IconValue;
  itemMoveUp: IconValue;
  itemMoveDown: IconValue;
  itemDelete: IconValue;
  search: IconValue;
  treeExpand: IconValue;
  treeCollapse: IconValue;
  visibilityOff: IconValue;
  visibilityOn: IconValue;
  calendarClock: IconValue;
  clock: IconValue;
  passwordHide: IconValue;
  passwordShow: IconValue;
  typeArray: IconValue;
  typeBoolean: IconValue;
  typeNull: IconValue;
  typeNumber: IconValue;
  typeObject: IconValue;
  typeString: IconValue;
  typeUnknown: IconValue;
  validationError: IconValue;
}

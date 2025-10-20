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
  itemMoveUp: IconValue;
  itemMoveDown: IconValue;
  itemDelete: IconValue;
  calendarClock: IconValue;
  clock: IconValue;
  passwordHide: IconValue;
  passwordShow: IconValue;
  validationError: IconValue;
}

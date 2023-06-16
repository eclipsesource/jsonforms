export interface CombinatorDefaultTranslation {
  key: CombinatorTranslationEnum;
  default: (variable?: string) => string;
}

export enum CombinatorTranslationEnum {
  clearDialogTitle = 'clearDialogTitle',
  clearDialogMessage = 'clearDialogMessage',
  clearDialogAccept = 'clearDialogAccept',
  clearDialogDecline = 'clearDialogDecline',
}

export type CombinatorTranslations = {
  [key in CombinatorTranslationEnum]?: string;
};

export const combinatorDefaultTranslations: CombinatorDefaultTranslation[] = [
  {
    key: CombinatorTranslationEnum.clearDialogTitle,
    default: () => 'Clear form?',
  },
  {
    key: CombinatorTranslationEnum.clearDialogMessage,
    default: () => 'Your data will be cleared. Do you want to proceed?',
  },
  { key: CombinatorTranslationEnum.clearDialogAccept, default: () => 'Yes' },
  { key: CombinatorTranslationEnum.clearDialogDecline, default: () => 'No' },
];

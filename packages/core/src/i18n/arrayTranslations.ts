export interface ArrayDefaultTranslation {
  key: ArrayTranslationEnum;
  default: (variable?: string) => string;
}

export enum ArrayTranslationEnum {
  addTooltip = 'addTooltip',
  addAriaLabel = 'addAriaLabel',
  removeTooltip = 'removeTooltip',
  upAriaLabel = 'upAriaLabel',
  downAriaLabel = 'downAriaLabel',
  noSelection = 'noSelection',
  removeAriaLabel = 'removeAriaLabel',
  noDataMessage = 'noDataMessage',
  deleteDialogTitle = 'deleteDialogTitle',
  deleteDialogMessage = 'deleteDialogMessage',
  deleteDialogAccept = 'deleteDialogAccept',
  deleteDialogDecline = 'deleteDialogDecline',
  up = 'up',
  down = 'down',
}

export type ArrayTranslations = {
  [key in ArrayTranslationEnum]?: string;
};

export const arrayDefaultTranslations: ArrayDefaultTranslation[] = [
  {
    key: ArrayTranslationEnum.addTooltip,
    default: (input) => (input ? `Add to ${input}` : 'Add'),
  },
  {
    key: ArrayTranslationEnum.addAriaLabel,
    default: (input) => (input ? `Add to ${input} button` : 'Add button'),
  },
  { key: ArrayTranslationEnum.removeTooltip, default: () => 'Delete' },
  { key: ArrayTranslationEnum.removeAriaLabel, default: () => 'Delete button' },
  { key: ArrayTranslationEnum.upAriaLabel, default: () => `Move item up` },
  { key: ArrayTranslationEnum.up, default: () => 'Up' },
  { key: ArrayTranslationEnum.down, default: () => 'Down' },
  { key: ArrayTranslationEnum.downAriaLabel, default: () => `Move item down` },
  { key: ArrayTranslationEnum.noDataMessage, default: () => 'No data' },
  { key: ArrayTranslationEnum.noSelection, default: () => 'No selection' },
  {
    key: ArrayTranslationEnum.deleteDialogTitle,
    default: () => 'Confirm Deletion',
  },
  {
    key: ArrayTranslationEnum.deleteDialogMessage,
    default: () => 'Are you sure you want to delete the selected entry?',
  },
  { key: ArrayTranslationEnum.deleteDialogAccept, default: () => 'Yes' },
  { key: ArrayTranslationEnum.deleteDialogDecline, default: () => 'No' },
];

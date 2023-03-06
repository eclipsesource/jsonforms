export interface ArrayDefaultTranslation {
    key: ArrayTranslationEnum,
    default: (variable?: string) => string
}

export enum ArrayTranslationEnum{
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
    deleteDialogDecline = 'deleteDialogDecline'
}

export type ArrayTranslations = {
    [key in ArrayTranslationEnum]?: string
}

export const arrayDefaultTranslations: ArrayDefaultTranslation[] = [
    {key: ArrayTranslationEnum.addTooltip, default: (input) => input?`Add to ${input}`:'Add'},
    {key: ArrayTranslationEnum.addAriaLabel, default: (input) => input?`Add to ${input}`:'Add'},
    {key: ArrayTranslationEnum.removeTooltip, default: () => 'Delete'},
    {key: ArrayTranslationEnum.upAriaLabel, default: (input) => `Move ${input} up`},
    {key: ArrayTranslationEnum.downAriaLabel, default: (input) => `Move ${input} down`},
    {key: ArrayTranslationEnum.removeAriaLabel, default: () => 'Delete button'},
    {key: ArrayTranslationEnum.noDataMessage, default: () => 'No Data'},
    {key: ArrayTranslationEnum.noSelection, default: () => 'No Selection'},
    {key: ArrayTranslationEnum.deleteDialogTitle, default: () => 'Confirm Deletion'},
    {key: ArrayTranslationEnum.deleteDialogMessage, default: () => 'Are you sure you want to delete the selected entry?'},
    {key: ArrayTranslationEnum.deleteDialogAccept, default: () => 'Yes'},
    {key: ArrayTranslationEnum.deleteDialogDecline, default: () => 'No'}
]
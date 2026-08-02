export interface MixedRendererDefaultTranslation {
  key: MixedRendererTranslationEnum;
  default: (variable?: string | number | null) => string;
}

export enum MixedRendererTranslationEnum {
  searchLabel = 'searchLabel',
  showPrimitives = 'showPrimitives',
  hidePrimitives = 'hidePrimitives',
  renameTooltip = 'renameTooltip',
  renameAriaLabel = 'renameAriaLabel',
  deleteTooltip = 'deleteTooltip',
  deleteAriaLabel = 'deleteAriaLabel',
  viewTooltip = 'viewTooltip',
  viewAriaLabel = 'viewAriaLabel',
  itemLabel = 'itemLabel',
}

export const mixedRendererDefaultTranslations: MixedRendererDefaultTranslation[] =
  [
    {
      key: MixedRendererTranslationEnum.searchLabel,
      default: () => 'Search',
    },
    {
      key: MixedRendererTranslationEnum.showPrimitives,
      default: () => 'Show primitives',
    },
    {
      key: MixedRendererTranslationEnum.hidePrimitives,
      default: () => 'Hide primitives',
    },
    {
      key: MixedRendererTranslationEnum.renameTooltip,
      default: () => 'Rename',
    },
    {
      key: MixedRendererTranslationEnum.renameAriaLabel,
      default: (input) =>
        input ? `Rename property '${input}' button` : 'Rename property button',
    },
    {
      key: MixedRendererTranslationEnum.deleteTooltip,
      default: () => 'Delete',
    },
    {
      key: MixedRendererTranslationEnum.deleteAriaLabel,
      default: (input) =>
        input ? `Delete property '${input}' button` : 'Delete property button',
    },
    {
      key: MixedRendererTranslationEnum.viewTooltip,
      default: (input) => (input ? `View ${input}` : 'View'),
    },
    {
      key: MixedRendererTranslationEnum.viewAriaLabel,
      default: (input) => (input ? `View ${input} button` : 'View button'),
    },
    {
      key: MixedRendererTranslationEnum.itemLabel,
      default: (input) => `Item ${input ?? ''}`.trim(),
    },
  ];

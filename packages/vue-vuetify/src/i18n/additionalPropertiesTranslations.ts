import type { ComputedRef } from 'vue';

export interface AdditionalPropertiesDefaultTranslation {
  key: AdditionalPropertiesTranslationEnum;
  default: (variable?: string | null) => string;
}

export enum AdditionalPropertiesTranslationEnum {
  addTooltip = 'addTooltip',
  addAriaLabel = 'addAriaLabel',
  removeTooltip = 'removeTooltip',
  removeAriaLabel = 'removeAriaLabel',
  propertyNameLabel = 'propertyNameLabel',
  propertyNameInvalid = 'propertyNameInvalid',
  propertyAlreadyDefined = 'propertyAlreadyDefined',
}

export type AdditionalPropertiesTranslations = {
  [key in AdditionalPropertiesTranslationEnum]?:
    | string
    | ComputedRef<string | null>;
};

export const additionalPropertiesDefaultTranslations: AdditionalPropertiesDefaultTranslation[] =
  [
    {
      key: AdditionalPropertiesTranslationEnum.addTooltip,
      default: (input) => (input ? `Add to ${input}` : 'Add'),
    },
    {
      key: AdditionalPropertiesTranslationEnum.addAriaLabel,
      default: (input) => (input ? `Add to ${input} button` : 'Add button'),
    },
    {
      key: AdditionalPropertiesTranslationEnum.removeTooltip,
      default: () => 'Delete',
    },
    {
      key: AdditionalPropertiesTranslationEnum.removeAriaLabel,
      default: () => 'Delete button',
    },
    {
      key: AdditionalPropertiesTranslationEnum.propertyNameLabel,
      default: () => 'Property Name',
    },
    {
      key: AdditionalPropertiesTranslationEnum.propertyNameInvalid,
      default: (input) =>
        input
          ? `Property name '${input}' is invalid`
          : 'Property name is invalid',
    },
    {
      key: AdditionalPropertiesTranslationEnum.propertyAlreadyDefined,
      default: (input) =>
        input
          ? `Property '${input}' already defined`
          : 'Property already defined',
    },
  ];

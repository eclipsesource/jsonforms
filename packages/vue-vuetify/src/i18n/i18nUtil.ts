import { computed, type Ref } from 'vue';
import {
  AdditionalPropertiesTranslationEnum,
  type AdditionalPropertiesDefaultTranslation,
  type AdditionalPropertiesTranslations,
} from './additionalPropertiesTranslations';
import { addI18nKeyToPrefix, type Translator } from '@jsonforms/core';
import {
  mixedRendererDefaultTranslations,
  MixedRendererTranslationEnum,
} from './mixedRendererTranslations';

export const getAdditionalPropertyTranslation = (
  t: Translator,
  defaultTranslations: AdditionalPropertiesDefaultTranslation[],
  i18nKeyPrefix: string,
  key: AdditionalPropertiesTranslationEnum,
  variable?: string | null,
): string => {
  const translation = defaultTranslations.find((entry) => entry.key === key);
  const defaultMessage = translation?.default(variable) ?? key;
  return t(addI18nKeyToPrefix(i18nKeyPrefix, key), defaultMessage, variable);
};

export const getAdditionalPropertiesTranslations = (
  t: Translator,
  defaultTranslations: AdditionalPropertiesDefaultTranslation[],
  i18nKeyPrefix: string,
  label: string,
  propertyName: Ref<string | null>,
): AdditionalPropertiesTranslations => {
  const translations: AdditionalPropertiesTranslations = {};
  defaultTranslations.forEach((controlElement) => {
    const key = addI18nKeyToPrefix(i18nKeyPrefix, controlElement.key);

    if (
      controlElement.key ==
      AdditionalPropertiesTranslationEnum.propertyAlreadyDefined
    ) {
      translations[controlElement.key] = computed(() =>
        t(key, controlElement.default(propertyName.value), propertyName.value),
      );
    } else if (
      controlElement.key ==
      AdditionalPropertiesTranslationEnum.propertyNameInvalid
    ) {
      translations[controlElement.key] = computed(() =>
        t(key, controlElement.default(propertyName.value), propertyName.value),
      );
    } else {
      translations[controlElement.key] = t(
        key,
        controlElement.default(label),
        label,
      );
    }
  });
  return translations;
};

export interface MixedRendererTranslations {
  searchLabel: string;
  showPrimitives: string;
  hidePrimitives: string;
  renameTooltip: string;
  renameAriaLabel: (propertyName: string) => string;
  deleteTooltip: string;
  deleteAriaLabel: (propertyName: string) => string;
  viewTooltip: (label: string) => string;
  viewAriaLabel: (label: string) => string;
  itemLabel: (index: number) => string;
}

export const getMixedRendererTranslations = (
  t: Translator,
  i18nKeyPrefix: string,
): MixedRendererTranslations => {
  const translate = (
    key: MixedRendererTranslationEnum,
    variable?: string | number | null,
  ): string => {
    const translation = mixedRendererDefaultTranslations.find(
      (entry) => entry.key === key,
    );
    const defaultMessage = translation?.default(variable) ?? key;
    return t(addI18nKeyToPrefix(i18nKeyPrefix, key), defaultMessage, variable);
  };

  return {
    searchLabel: translate(MixedRendererTranslationEnum.searchLabel),
    showPrimitives: translate(MixedRendererTranslationEnum.showPrimitives),
    hidePrimitives: translate(MixedRendererTranslationEnum.hidePrimitives),
    renameTooltip: translate(MixedRendererTranslationEnum.renameTooltip),
    renameAriaLabel: (propertyName) =>
      translate(MixedRendererTranslationEnum.renameAriaLabel, propertyName),
    deleteTooltip: translate(MixedRendererTranslationEnum.deleteTooltip),
    deleteAriaLabel: (propertyName) =>
      translate(MixedRendererTranslationEnum.deleteAriaLabel, propertyName),
    viewTooltip: (label) =>
      translate(MixedRendererTranslationEnum.viewTooltip, label),
    viewAriaLabel: (label) =>
      translate(MixedRendererTranslationEnum.viewAriaLabel, label),
    itemLabel: (index) =>
      translate(MixedRendererTranslationEnum.itemLabel, index),
  };
};

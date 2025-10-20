import { computed, type Ref } from 'vue';
import {
  AdditionalPropertiesTranslationEnum,
  type AdditionalPropertiesDefaultTranslation,
  type AdditionalPropertiesTranslations,
} from './additionalPropertiesTranslations';
import { addI18nKeyToPrefix, type Translator } from '@jsonforms/core';

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

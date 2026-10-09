import { createTranslator } from '@jsonforms/core';
import { describe, expect, it } from 'vitest';
import { additionalPropertiesDefaultTranslations } from '../../../src/i18n/additionalPropertiesTranslations';
import {
  getAdditionalPropertyTranslation,
  getMixedRendererTranslations,
} from '../../../src/i18n/i18nUtil';
import { AdditionalPropertiesTranslationEnum } from '../../../src/i18n';

describe('Vuetify i18n utilities', () => {
  it('uses translated Additional Properties action labels with their values', () => {
    const translate = createTranslator((id, _defaultMessage, value) =>
      id === 'control.additionalProperties.renameAriaLabel'
        ? `Edit ${value}`
        : undefined,
    );

    expect(
      getAdditionalPropertyTranslation(
        translate,
        additionalPropertiesDefaultTranslations,
        'control.additionalProperties',
        AdditionalPropertiesTranslationEnum.renameAriaLabel,
        'dynamicKey',
      ),
    ).toBe('Edit dynamicKey');
  });

  it('provides translated mixed tree strings and generated item labels', () => {
    const translate = createTranslator((id, _defaultMessage, value) => {
      if (id === 'control.mixedRenderer.searchLabel') {
        return 'Find node';
      }
      if (id === 'control.mixedRenderer.itemLabel') {
        return `Entry ${value}`;
      }
      if (id === 'control.mixedRenderer.renameAriaLabel') {
        return `Edit ${value} button`;
      }
      return undefined;
    });

    const translations = getMixedRendererTranslations(
      translate,
      'control.mixedRenderer',
    );

    expect(translations.searchLabel).toBe('Find node');
    expect(translations.itemLabel(3)).toBe('Entry 3');
    expect(translations.renameAriaLabel('dynamicKey')).toBe(
      'Edit dynamicKey button',
    );
    expect(translations.showPrimitives).toBe('Show primitives');
  });
});

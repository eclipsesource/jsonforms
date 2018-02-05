import * as _ from 'lodash';
import { getTranslations, i18nReducer } from './reducers';

export interface Translations {
  [key: string]: string;
}

export const translateLabel: (translations: Translations,
                              label: string) => string =
  (translations, label) => {

    if (translations && _.startsWith(label, '%')) {
      const labelKey = label.substr(1, label.length);

      return translations[labelKey] ? translations[labelKey] : label;
    }

    return label;
  };

export const translateProps = (state, props) => {
  const label = translateLabel(getTranslations(state), props.label);

  return {
    ...props,
    label
  };
};

export { i18nReducer };

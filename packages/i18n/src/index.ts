import * as _ from 'lodash';
import { getTranslations, i18nReducer } from './reducers';

export const translateLabel = (translations, label: string): string => {
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

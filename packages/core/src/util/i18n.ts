import * as _ from 'lodash';

export const translate = (translations, text: string): string => {
  if (translations && _.startsWith(text, '%')) {
    const translationKey = text.substr(1, text.length);
    text = translations[translationKey] ? translations[translationKey] : text;
  }

  return text;
};

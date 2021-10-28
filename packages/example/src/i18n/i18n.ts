import get from 'lodash/get';

const en = {
  name: {
    label: 'Name',
    description: 'The name of the person',
  },
  vegetarian: {
    label: 'Vegetarian',
    description: 'Wether the person is a vegetarian',
  },
  birth: {
    label: 'Birth Date',
    description: '',
  },
  nationality: {
    label: 'Nationality',
    description: '',
  },
  'personal-data': {
    age: {
      label: 'Age',
    },
    driving: {
      label: 'Driving Skill',
      description: 'Indicating experience level',
    },
  },
  height: {
    label: 'Height',
  },
  occupation: {
    label: 'Occupation',
    description: '',
  },
  'postal-code': {
    label: 'Postal Code',
  },
  error: {
    required: 'field is required',
  },
};

const de = {
  name: {
    label: 'Name',
    description: 'Der Name der Person',
  },
  vegetarian: {
    label: 'Vegetarier',
    description: 'Isst die Person vegetarisch?',
  },
  birth: {
    label: 'Geburtsdatum',
    description: '',
  },
  nationality: {
    label: 'Nationalität',
    description: '',
    Other: 'Andere',
  },
  'personal-data': {
    age: {
      label: 'Alter',
    },
    driving: {
      label: 'Fahrkenntnisse',
      description: 'Fahrerfahrung der Person',
    },
  },
  height: {
    label: 'Größe',
  },
  occupation: {
    label: 'Beruf',
    description: '',
  },
  'postal-code': {
    label: 'Postleitzahl',
  },
  error: {
    required: 'Pflichtfeld',
  },
  'Additional Information': 'Zusätzliche Informationen',
};

export const createTranslator =
  (locale: 'en' | 'de') =>
  (key: string, defaultMessage: string | undefined): string | undefined => {
    return get(locale === 'en' ? en : de, key) ?? defaultMessage;
  };

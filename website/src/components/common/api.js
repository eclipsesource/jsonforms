export class API {
  url;

  constructor(url) {
    this.url = url;
  }

  async get(endpoint){
    switch (this.url + '/' + endpoint) {
      case 'www.api.com/regions/Germany':
        return germanStates;
      case 'www.api.com/regions/US':
        return usStates;
      case 'www.api.com/countries':
        return ['Germany', 'US'];
      default:
        return [];
    }
  }
}

const germanStates = [
  'Berlin',
  'Bayern',
  'Niedersachsen',
  'Baden-Württemberg',
  'Rheinland-Pfalz',
  'Sachsen',
  'Thüringen',
  'Hessen',
  'Nordrhein-Westfalen',
  'Sachsen-Anhalt',
  'Brandenburg',
  'Mecklenburg-Vorpommern',
  'Hamburg',
  'Schleswig-Holstein',
  'Saarland',
  'Bremen',
];

const usStates = [
  'Alabama',
  'Alaska',
  'Arizona',
  'Arkansas',
  'California',
  'Colorado',
  'Connecticut',
  'Delaware',
  'Florida',
  'Georgia',
  'Hawaii',
  'Idaho',
  'Illinois',
  'Indiana',
  'Iowa',
  'Kansas',
  'Kentucky',
  'Louisiana',
  'Maine',
  'Maryland',
  'Massachusetts',
  'Michigan',
  'Minnesota',
  'Mississippi',
  'Missouri',
  'Montana',
  'Nebraska',
  'Nevada',
  'New Hampshire',
  'New Jersey',
  'New Mexico',
  'New York',
  'North Carolina',
  'North Dakota',
  'Ohio',
  'Oklahoma',
  'Oregon',
  'Pennsylvania',
  'Rhode Island',
  'South Carolina',
  'South Dakota',
  'Tennessee',
  'Texas',
  'Utah',
  'Vermont',
  'Virginia',
  'Washington',
  'West Virginia',
  'Wisconsin',
  'Wyoming',
];

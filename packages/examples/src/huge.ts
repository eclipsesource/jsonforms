import { registerExamples } from './register';
import { UISchemaElement } from '@jsonforms/core';
const schema = {
  $schema: 'http://json-schema.org/schema#',

  definitions: {
    genderTypes: {
      type: 'string',
      enum: [
        'http://gedcomx.org/Male',
        'http://gedcomx.org/Female',
        'http://gedcomx.org/Unknown'
      ]
    },
    nameTypes: {
      type: 'string',
      enum: [
        'http://gedcomx.org/BirthName',
        'http://gedcomx.org/MarriedName',
        'http://gedcomx.org/AlsoKnownAs',
        'http://gedcomx.org/Nickname',
        'http://gedcomx.org/AdoptiveName',
        'http://gedcomx.org/FormalName',
        'http://gedcomx.org/ReligiousName'
      ]
    },
    namePartTypes: {
      enum: [
        'http://gedcomx.org/Prefix',
        'http://gedcomx.org/Suffix',
        'http://gedcomx.org/Given',
        'http://gedcomx.org/Surname'
      ]
    },
    personFactTypes: {
      type: 'string',
      enum: [
        'http://gedcomx.org/Adoption',
        'http://gedcomx.org/AdultChristening',
        'http://gedcomx.org/Amnesty',
        'http://gedcomx.org/Apprenticeship',
        'http://gedcomx.org/Arrest',
        'http://gedcomx.org/Baptism',
        'http://gedcomx.org/BarMitzvah',
        'http://gedcomx.org/BatMitzvah',
        'http://gedcomx.org/Birth',
        'http://gedcomx.org/Blessing',
        'http://gedcomx.org/Burial',
        'http://gedcomx.org/Caste',
        'http://gedcomx.org/Census',
        'http://gedcomx.org/Christening',
        'http://gedcomx.org/Circumcision',
        'http://gedcomx.org/Clan',
        'http://gedcomx.org/Confirmation',
        'http://gedcomx.org/Cremation',
        'http://gedcomx.org/Death',
        'http://gedcomx.org/Education',
        'http://gedcomx.org/Emigration',
        'http://gedcomx.org/Ethnicity',
        'http://gedcomx.org/Excommunication',
        'http://gedcomx.org/FirstCommunion',
        'http://gedcomx.org/Funeral',
        'http://gedcomx.org/GenderChange',
        'http://gedcomx.org/Heimat',
        'http://gedcomx.org/Immigration',
        'http://gedcomx.org/Imprisonment',
        'http://gedcomx.org/LandTransaction',
        'http://gedcomx.org/Language',
        'http://gedcomx.org/Living',
        'http://gedcomx.org/MaritalStatus',
        'http://gedcomx.org/Medical',
        'http://gedcomx.org/MilitaryAward',
        'http://gedcomx.org/MilitaryDischarge',
        'http://gedcomx.org/MilitaryDraftRegistration',
        'http://gedcomx.org/MilitaryInduction',
        'http://gedcomx.org/MilitaryService',
        'http://gedcomx.org/Mission',
        'http://gedcomx.org/MoveTo',
        'http://gedcomx.org/MoveFrom',
        'http://gedcomx.org/MultipleBirth',
        'http://gedcomx.org/NationalId',
        'http://gedcomx.org/Nationality',
        'http://gedcomx.org/Naturalization',
        'http://gedcomx.org/NumberOfChildren',
        'http://gedcomx.org/NumberOfMarriages',
        'http://gedcomx.org/Occupation',
        'http://gedcomx.org/Ordination',
        'http://gedcomx.org/Pardon',
        'http://gedcomx.org/PhysicalDescription',
        'http://gedcomx.org/Probate',
        'http://gedcomx.org/Property',
        'http://gedcomx.org/Religion',
        'http://gedcomx.org/Residence',
        'http://gedcomx.org/Retirement',
        'http://gedcomx.org/Stillbirth',
        'http://gedcomx.org/Will',
        'http://gedcomx.org/Visit',
        'http://gedcomx.org/Yahrzeit'
      ]
    },
    uri: {
      type: 'string'
    },
    localeTag: {
      type: 'string'
      //   pattern:
      //     "^(((((?'language'[a-z]{2,3})(-(?'extlang'[a-z]{3})){0,3})|(?'language'[a-z]{4})|(?'language'[a-z]{5,8}))(-(?'script'[a-z]{4}))?(-(?'region'[a-z]{2}|[0-9]{3}))?(-(?'variant'[a-z0-9]{5,8}|[0-9][a-z0-9]{3}))*(-(?'extensions'[a-z0-9-[x]](-[a-z0-9]{2,8})+))*(-x(- (?'privateuse'[a-z0-9]{1,8}))+)?)|(x(- (?'privateuse'[a-z0-9]{1,8}))+)|(?'grandfathered'(?'irregular'en-GB-oed |i-ami |i-bnn |i-default |i-enochian |i-hak |i-klingon |i-lux |i-mingo |i-navajo |i-pwn |i-tao |i-tay |i-tsu |sgn-BE-FR |sgn-BE-NL |sgn-CH-DE)|(?'regular'art-lojban |cel-gaulish |no-bok |no-nyn |zh-guoyu |zh-hakka |zh-min |zh-min-nan |zh-xiang)))$"
    },
    resourceReference: {
      type: 'object',
      properties: {
        resource: { $ref: '#/definitions/uri' }
      }
    },
    identifier: {
      type: 'object',
      properties: {}
    },
    attribution: {
      type: 'object',
      properties: {
        contributor: { $ref: '#/definitions/resourceReference' },
        modified: { type: 'integer' },
        changeMessage: { type: 'string' }
      }
    },
    note: {
      type: 'object',
      properties: {
        lang: { $ref: '#/definitions/localeTag' },
        subject: { type: 'string' },
        text: { type: 'string' },
        attribution: { $ref: '#/definitions/attribution' }
      },
      required: ['text']
    },
    textValue: {
      type: 'object',
      properties: {
        lang: { $ref: '#/definitions/localeTag' },
        value: { type: 'string' }
      },
      required: ['value']
    },
    sourceCitation: {
      type: 'object',
      properties: {
        lang: { $ref: '#/definitions/localeTag' },
        value: { type: 'string' }
      },
      required: ['value']
    },
    sourceReference: {
      type: 'object',
      properties: {
        description: { $ref: '#/definitions/uri' },
        attribution: { $ref: '#/definitions/attribution' }
      },
      required: ['description']
    },
    evidenceReference: {
      type: 'object',
      properties: {
        resource: { $ref: '#/definitions/uri' },
        attribution: { $ref: '#/definitions/attribution' }
      },
      required: ['resource']
    },
    onlineAccount: {
      type: 'object',
      properties: {
        serviceHomepage: { $ref: '#/definitions/resourceReference' },
        accountName: { type: 'string' }
      },
      required: ['serviceHomepage', 'accountName']
    },
    address: {
      type: 'object',
      properties: {
        value: { type: 'string' },
        city: { type: 'string' },
        country: { type: 'string' },
        postalCode: { type: 'string' },
        stateOrProvince: { type: 'string' },
        street: { type: 'string' },
        street2: { type: 'string' },
        street3: { type: 'string' },
        street4: { type: 'string' },
        street5: { type: 'string' },
        street6: { type: 'string' }
      }
    },
    conclusion: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        lang: { $ref: '#/definitions/localeTag' },
        sources: {
          type: 'array',
          items: { $ref: '#/definitions/sourceReference' }
        },
        analysis: { $ref: '#/definitions/resourceReference' },
        notes: {
          type: 'array',
          items: { $ref: '#/definitions/note' }
        },
        confidence: { $ref: '#/definitions/uri' }
      }
    },
    subject: {
      allOf: [
        { $ref: '#/definitions/conclusion' },
        {
          properties: {
            extracted: { type: 'boolean' },
            evidence: {
              type: 'array',
              items: { $ref: '#/definitions/evidenceReference' }
            },
            media: {
              type: 'array',
              items: { $ref: '#/definitions/sourceReference' }
            },
            identifiers: { $ref: '#/definitions/identifier' },
            attribution: { $ref: '#/definitions/attribution' }
          }
        }
      ]
    },
    gender: {
      allOf: [
        { $ref: '#/definitions/conclusion' },
        {
          properties: {
            type: {
              anyOf: [
                { $ref: '#/definitions/uri' },
                { $ref: '#/definitions/genderTypes' }
              ]
            }
          },
          required: ['type']
        }
      ]
    },
    date: {
      type: 'object',
      properties: {
        original: { type: 'string' },
        formal: {
          type: 'string',
          pattern:
            '^(A?[\\+-]\\d{4}(-\\d{2})?(-\\d{2})?T?(\\d{2})?(:\\d{2})?(:\\d{2})?([\\+-]\\d{2}(:\\d{2})?|Z)?)|(P(\\d{0,4}Y)?(\\d{0,4}M)?(\\d{0,4}D)?(T(\\d{0,4}H)?(\\d{0,4}M)?(\\d{0,4}S)?)?)$'
        }
      }
    },
    qualifier: {
      type: 'object',
      properties: {
        name: { $ref: '#/definitions/uri' },
        value: { type: 'string' }
      },
      required: ['name']
    },
    name: {
      allOf: [
        { $ref: '#/definitions/conclusion' },
        {
          properties: {
            type: {
              anyOf: [
                { $ref: '#/definitions/uri' },
                { $ref: '#/definitions/nameTypes' }
              ]
            },
            date: { $ref: '#/definitions/date' },
            nameForms: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  lang: { $ref: '#/definitions/localeTag' },
                  fullText: { type: 'string' },
                  parts: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        type: {
                          anyOf: [
                            { $ref: '#/definitions/uri' },
                            { $ref: '#/definitions/namePartTypes' }
                          ]
                        },
                        value: { type: 'string' },
                        qualifiers: {
                          type: 'array',
                          items: { $ref: '#/definitions/qualifier' }
                        }
                      },
                      required: ['value']
                    }
                  }
                }
              }
            }
          },
          required: ['nameForms']
        }
      ]
    },
    fact: {
      allOf: [
        { $ref: '#/definitions/conclusion' },
        {
          properties: {
            type: {
              anyOf: [
                { $ref: '#/definitions/uri' },
                { $ref: '#/definitions/personFactTypes' }
              ]
            },
            date: { $ref: '#/definitions/date' },
            place: { $ref: '#/definitions/placeReference' },
            value: { type: 'string' },
            qualifiers: {
              type: 'array',
              items: { $ref: '#/definitions/qualifier' }
            }
          },
          required: ['type']
        }
      ]
    },
    eventRole: {
      allOf: [
        { $ref: '#/definitions/conclusion' },
        {
          properties: {
            person: { $ref: '#/definitions/resourceReference' },
            type: { $ref: '#/definitions/uri' },
            details: { type: 'string' }
          },
          required: ['person']
        }
      ]
    },
    placeReference: {
      type: 'object',
      properties: {
        original: { type: 'string' },
        description: { $ref: '#/definitions/uri' }
      }
    },
    coverage: {
      type: 'object',
      properties: {
        spatial: { $ref: '#/definitions/placeReference' },
        temporal: { $ref: '#/definitions/date' }
      }
    },
    person: {
      allOf: [
        { $ref: '#/definitions/subject' },
        {
          properties: {
            private: { type: 'boolean' },
            gender: { $ref: '#/definitions/gender' },
            names: {
              type: 'array',
              items: { $ref: '#/definitions/name' }
            },
            facts: {
              type: 'array',
              items: { $ref: '#/definitions/fact' }
            }
          }
        }
      ]
    },
    relationship: {
      allOf: [
        { $ref: '#/definitions/subject' },
        {
          properties: {
            type: { $ref: '#/definitions/uri' },
            person1: { $ref: '#/definitions/resourceReference' },
            person2: { $ref: '#/definitions/resourceReference' },
            facts: {
              type: 'array',
              items: { $ref: '#/definitions/fact' }
            }
          },
          required: ['person1', 'person2']
        }
      ]
    },
    sourceDescription: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        resourceType: { $ref: '#/definitions/uri' },
        citations: {
          type: 'array',
          items: { $ref: '#/definitions/sourceCitation' }
        },
        mediaType: { type: 'string' },
        about: { $ref: '#/definitions/uri' },
        mediator: { $ref: '#/definitions/resourceReference' },
        sources: {
          type: 'array',
          items: { $ref: '#/definitions/sourceReference' }
        },
        analysis: { $ref: '#/definitions/resourceReference' },
        componentOf: { $ref: '#/definitions/sourceReference' },
        titles: {
          type: 'array',
          items: { $ref: '#/definitions/textValue' }
        },
        notes: {
          type: 'array',
          items: { $ref: '#/definitions/note' }
        },
        attribution: { $ref: '#/definitions/attribution' },
        rights: {
          type: 'array',
          items: { $ref: '#/definitions/resourceReference' }
        },
        coverage: { $ref: '#/definitions/coverage' },
        descriptions: {
          type: 'array',
          items: { $ref: '#/definitions/textValue' }
        },
        identifiers: {
          type: 'array',
          items: { $ref: '#/definitions/identifier' }
        },
        created: { type: 'integer' },
        modified: { type: 'integer' },
        repository: { $ref: '#/definitions/resourceReference' }
      },
      required: ['citations']
    },
    agent: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        identifiers: {
          type: 'array',
          items: { $ref: '#/definitions/identifier' }
        },
        names: {
          type: 'array',
          items: { $ref: '#/definitions/textValue' }
        },
        homepage: { $ref: '#/definitions/resourceReference' },
        openid: { $ref: '#/definitions/resourceReference' },
        accounts: {
          type: 'array',
          items: { $ref: '#/definitions/onlineAccount' }
        },
        emails: {
          type: 'array',
          items: { $ref: '#/definitions/resourceReference' }
        },
        phones: {
          type: 'array',
          items: { $ref: '#/definitions/resourceReference' }
        },
        addresses: {
          type: 'array',
          items: { $ref: '#/definitions/address' }
        },
        person: { $ref: '#/definitions/resourceReference' }
      }
    },
    event: {
      allOf: [
        { $ref: '#/definitions/subject' },
        {
          properties: {
            type: { $ref: '#/definitions/uri' },
            date: { $ref: '#/definitions/date' },
            place: { $ref: '#/definitions/placeReference' },
            roles: {
              type: 'array',
              items: { $ref: '#/definitions/eventRole' }
            }
          }
        }
      ]
    },
    document: {
      allOf: [
        { $ref: '#/definitions/conclusion' },
        {
          properties: {
            type: { $ref: '#/definitions/uri' },
            extracted: { type: 'boolean' },
            textType: { type: 'string' },
            text: { type: 'string' },
            attribution: { $ref: '#/definitions/attribution' }
          },
          required: ['text']
        }
      ]
    },
    placeDescription: {
      allOf: [
        { $ref: '#/definitions/subject' },
        {
          properties: {
            names: {
              type: 'array',
              items: { $ref: '#/definitions/textValue' }
            },
            type: { $ref: '#/definitions/uri' },
            place: { $ref: '#/definitions/resourceReference' },
            jurisdiction: { $ref: '#/definitions/resourceReference' },
            latitude: { type: 'number' },
            longitude: { type: 'number' },
            temporalDescription: { $ref: '#/definitions/date' },
            spatialDescription: { $ref: '#/definitions/resourceReference' }
          },
          required: ['names']
        }
      ]
    }
  },

  type: 'object',
  properties: {
    persons: {
      type: 'array',
      items: { $ref: '#/definitions/person' }
    },
    relationships: {
      type: 'array',
      items: { $ref: '#/definitions/relationship' }
    },
    sourceDescriptions: {
      type: 'array',
      items: { $ref: '#/definitions/sourceDescription' }
    },
    agents: {
      type: 'array',
      items: { $ref: '#/definitions/agent' }
    },
    events: {
      type: 'array',
      items: { $ref: '#/definitions/event' }
    },
    documents: {
      type: 'array',
      items: { $ref: '#/definitions/document' }
    },
    places: {
      type: 'array',
      items: { $ref: '#/definitions/placeDescription' }
    },
    description: { type: 'string' },
    id: { type: 'string' },
    lang: { $ref: '#/definitions/localeTag' },
    attribution: { $ref: '#/definitions/attribution' }
  }
};

const data: any = {
  attribution: {
    contributor: {
      resource: '#A-1'
    },
    modified: 1398405600000
  },
  persons: [
    {
      names: [
        {
          nameForms: [
            {
              fullText: 'Samuel Ham'
            }
          ]
        }
      ],
      gender: {
        type: 'http://gedcomx.org/Male'
      },
      facts: [
        {
          type: 'http://gedcomx.org/Residence',
          date: {
            original: '3 November 1828',
            formal: '+1828-11-03'
          },
          place: {
            original: 'parish of Honiton, Devon, England'
          }
        }
      ],
      extracted: true,
      sources: [
        {
          description: '#S-2'
        }
      ],
      id: 'P-1'
    },
    {
      names: [
        {
          nameForms: [
            {
              fullText: 'Elizabeth Spiller'
            }
          ]
        }
      ],
      gender: {
        type: 'http://gedcomx.org/Female'
      },
      facts: [
        {
          type: 'http://gedcomx.org/Residence',
          date: {
            original: '3 November 1828',
            formal: '+1828-11-03'
          },
          place: {
            original: 'parish of Wilton, Somerset, England'
          }
        }
      ],
      extracted: true,
      sources: [
        {
          description: '#S-2'
        }
      ],
      id: 'P-2'
    },
    {
      names: [
        {
          nameForms: [
            {
              fullText: 'Jno. Pain'
            }
          ]
        }
      ],
      extracted: true,
      sources: [
        {
          description: '#S-2'
        }
      ],
      id: 'P-3'
    },
    {
      names: [
        {
          nameForms: [
            {
              fullText: 'R.G. Halls'
            }
          ]
        }
      ],
      extracted: true,
      sources: [
        {
          description: '#S-2'
        }
      ],
      id: 'P-4'
    },
    {
      names: [
        {
          nameForms: [
            {
              fullText: 'Peggy Hammet'
            }
          ]
        }
      ],
      extracted: true,
      sources: [
        {
          description: '#S-2'
        }
      ],
      id: 'P-5'
    },
    {
      names: [
        {
          nameForms: [
            {
              fullText: 'David Smith Stone'
            }
          ]
        }
      ],
      extracted: true,
      sources: [
        {
          description: '#S-2'
        }
      ],
      id: 'P-6'
    },
    {
      evidence: [
        {
          resource: '#P-1'
        }
      ],
      analysis: {
        resource: '#D-2'
      },
      id: 'C-1'
    }
  ],
  relationships: [
    {
      type: 'http://gedcomx.org/Couple',
      extracted: true,
      facts: [
        {
          type: 'http://gedcomx.org/Marriage',
          date: {
            original: '3 November 1828',
            formal: '+1828-11-03'
          },
          place: {
            original: 'Wilton St George, Wilton, Somerset, England'
          }
        }
      ],
      person1: {
        resource: '#P-1'
      },
      person2: {
        resource: '#P-2'
      }
    }
  ],
  sourceDescriptions: [
    {
      description: [
        {
          value:
            'Marriage entry for Samuel Ham and Elizabeth in a copy of the registers of the baptisms, marriages, and burials at the church of St. George in the parish of Wilton : adjoining Taunton, in the county of Somerset from A.D. 1558 to A.D. 1837.'
        }
      ],
      resourceType: 'http://gedcomx.org/PhysicalArtifact',
      citations: [
        {
          value:
            'Joseph Houghton Spencer, transcriber, Church of England, Parish Church of Wilton (Somerset). A copy of the registers of the baptisms, marriages, and burials at the church of St. George in the parish of Wilton : adjoining Taunton, in the county of Somerset from A.D. 1558 to A.D. 1837; Marriage entry for Samuel Ham and Elizabeth Spiller (3 November 1828), (Taunton: Barnicott, 1890), p. 224, No. 86.'
        }
      ],
      titles: [
        {
          value:
            'Marriage entry for Samuel Ham and Elizabeth Spiller, Parish Register, Wilton, Somerset, England'
        }
      ],
      repository: {
        resource: '#A-2'
      },
      id: 'S-1'
    },
    {
      description: [
        {
          value:
            'Transcription of marriage entry for Samuel Ham and Elizabeth in a copy of the registers of the baptisms, marriages, and burials at the church of St. George in the parish of Wilton : adjoining Taunton, in the county of Somerset from A.D. 1558 to A.D. 1837.'
        }
      ],
      sources: [
        {
          description: '#S-1'
        }
      ],
      resourceType: 'http://gedcomx.org/DigitalArtifact',
      citations: [
        {
          value:
            'Joseph Houghton Spencer, transcriber, Church of England, Parish Church of Wilton (Somerset). A copy of the registers of the baptisms, marriages, and burials at the church of St. George in the parish of Wilton : adjoining Taunton, in the county of Somerset from A.D. 1558 to A.D. 1837; Marriage entry for Samuel Ham and Elizabeth Spiller (3 November 1828), (Taunton: Barnicott, 1890), p. 224, No. 86.'
        }
      ],
      about: '#D-1',
      titles: [
        {
          value:
            'Transcription of marriage entry for Samuel Ham and Elizabeth Spiller, Parish Register, Wilton, Somerset, England'
        }
      ],
      id: 'S-2'
    }
  ],
  agents: [
    {
      names: [
        {
          value: 'Jane Doe'
        }
      ],
      emails: [
        {
          resource: 'mailto:example@example.org'
        }
      ],
      id: 'A-1'
    },
    {
      names: [
        {
          value: 'Family History Library'
        }
      ],
      addresses: [
        {
          city: 'Salt Lake City',
          stateOrProvince: 'Utah'
        }
      ],
      id: 'A-2'
    }
  ],
  events: [
    {
      type: 'http://gedcomx.org/Marriage',
      date: {
        original: '3 November 1828',
        formal: '+1828-11-03'
      },
      place: {
        original: 'Wilton St George, Wilton, Somerset, England'
      },
      roles: [
        {
          type: 'http://gedcomx.org/Principal',
          person: {
            resource: '#P-1'
          }
        },
        {
          type: 'http://gedcomx.org/Principal',
          person: {
            resource: '#P-2'
          }
        },
        {
          type: 'http://gedcomx.org/Witness',
          person: {
            resource: '#P-3'
          }
        },
        {
          type: 'http://gedcomx.org/Witness',
          person: {
            resource: '#P-4'
          }
        },
        {
          type: 'http://gedcomx.org/Witness',
          person: {
            resource: '#P-5'
          }
        },
        {
          type: 'http://gedcomx.org/Official',
          person: {
            resource: '#P-6'
          }
        }
      ],
      extracted: true,
      id: 'E-1'
    }
  ],
  documents: [
    {
      type: 'http://gedcomx.org/Transcription',
      text:
        'Samuel Ham of the parish of Honiton and Elizabeth Spiller\nwere married this 3rd day of November 1828 by David Smith\nStone, Pl Curate,\nIn the Presence of\nJno Pain.\nR.G. Halls.  Peggy Hammet.\nNo. 86.',
      sources: [
        {
          description: '#S-1'
        }
      ],
      lang: 'en',
      id: 'D-1'
    },
    {
      text: '...Jane Doe`s analysis document...',
      id: 'D-2'
    }
  ]
};

export const uischema: UISchemaElement = undefined;

registerExamples([
  {
    name: 'huge',
    label: 'Huge Test',
    data,
    schema,
    uischema
  }
]);

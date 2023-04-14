import { registerExamples } from '../register';
const schema = {
  $schema: 'http://json-schema.org/schema#',

  definitions: {
    confidenceTypes: {
      type: 'string',
      enum: [
        'http://gedcomx.org/High',
        'http://gedcomx.org/Medium',
        'http://gedcomx.org/Low',
      ],
    },
    genderTypes: {
      type: 'string',
      enum: [
        'http://gedcomx.org/Male',
        'http://gedcomx.org/Female',
        'http://gedcomx.org/Unknown',
        'http://gedcomx.org/Intersex',
      ],
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
        'http://gedcomx.org/ReligiousName',
      ],
    },
    namePartTypes: {
      enum: [
        'http://gedcomx.org/Prefix',
        'http://gedcomx.org/Suffix',
        'http://gedcomx.org/Given',
        'http://gedcomx.org/Surname',
      ],
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
        'http://gedcomx.org/Yahrzeit',
      ],
    },
    uri: {
      type: 'string',
    },
    localeTag: {
      type: 'string',
      //   pattern:
      //     "^(((((?'language'[a-z]{2,3})(-(?'extlang'[a-z]{3})){0,3})|(?'language'[a-z]{4})|(?'language'[a-z]{5,8}))(-(?'script'[a-z]{4}))?(-(?'region'[a-z]{2}|[0-9]{3}))?(-(?'variant'[a-z0-9]{5,8}|[0-9][a-z0-9]{3}))*(-(?'extensions'[a-z0-9-[x]](-[a-z0-9]{2,8})+))*(-x(- (?'privateuse'[a-z0-9]{1,8}))+)?)|(x(- (?'privateuse'[a-z0-9]{1,8}))+)|(?'grandfathered'(?'irregular'en-GB-oed |i-ami |i-bnn |i-default |i-enochian |i-hak |i-klingon |i-lux |i-mingo |i-navajo |i-pwn |i-tao |i-tay |i-tsu |sgn-BE-FR |sgn-BE-NL |sgn-CH-DE)|(?'regular'art-lojban |cel-gaulish |no-bok |no-nyn |zh-guoyu |zh-hakka |zh-min |zh-min-nan |zh-xiang)))$"
    },
    resourceReference: {
      type: 'object',
      properties: {
        resource: { $ref: '#/definitions/uri' },
      },
    },
    identifier: {
      type: 'object',
    },
    attribution: {
      title: 'Attribution',
      properties: {
        contributor: {
          $ref: '#/definitions/resourceReference',
          description:
            'Reference to the agent to whom the attributed data is attributed.',
        },
        modified: {
          type: 'number',
          description: 'Timestamp of when the attributed data was contributed.',
        },
        changeMessage: {
          type: 'string',
          description:
            'A statement of why the attributed data is being provided by the contributor.',
        },
        creator: {
          $ref: '#/definitions/resourceReference',
          description:
            'Reference to the agent that created the attributed data. The creator MAY be different from the contributor if changes were made to the attributed data.',
        },
        created: {
          type: 'number',
          description: 'Timestamp of when the attributed data was contributed.',
        },
      },
    },
    note: {
      title: 'Note',
      properties: {
        lang: {
          $ref: '#/definitions/localeTag',
          description: 'The locale identifier for the note.',
        },
        subject: {
          type: 'string',
          description: 'A subject or title for the note.',
        },
        text: { type: 'string', description: 'The text of the note.' },
        attribution: {
          $ref: '#/definitions/attribution',
          description: 'The attribution of this note.',
        },
      },
      required: ['text'],
    },
    textValue: {
      type: 'object',
      properties: {
        lang: {
          $ref: '#/definitions/localeTag',
          description: 'The locale identifier for the value of the text.',
        },
        value: { type: 'string', description: 'The text value.' },
      },
      required: ['value'],
    },
    sourceCitation: {
      type: 'object',
      properties: {
        lang: {
          $ref: '#/definitions/localeTag',
          description: 'The locale identifier for the bibliographic metadata.',
        },
        value: {
          type: 'string',
          description:
            'The bibliographic metadata rendered as a full citation.',
        },
      },
      required: ['value'],
    },
    sourceReference: {
      title: 'SourceReference',
      properties: {
        description: {
          $ref: '#/definitions/uri',
          description: 'Reference to a description of the target source.',
        },
        descriptionId: {
          type: 'string',
          description: 'The id of the target source.',
        },
        attribution: {
          $ref: '#/definitions/attribution',
          description: 'The attribution of this source reference.',
        },
        qualifiers: {
          items: { $ref: '#/definitions/sourceReferenceQualifier' },
          description:
            'Qualifiers for the reference, used to identify specific fragments of the source that are being referenced.',
        },
      },
      required: ['description'],
    },
    sourceReferenceQualifier: {
      properties: {
        name: {
          anyOf: [
            { $ref: '#/definitions/sourceReferenceQualifierNames' },
            { $ref: '#/definitions/uri' },
          ],
        },
        value: { type: 'string' },
      },
      required: ['name'],
    },
    sourceReferenceQualifierNames: {
      enum: [
        'http://gedcomx.org/CharacterRegion',
        'http://gedcomx.org/RectangleRegion',
        'http://gedcomx.org/TimeRegion',
      ],
    },
    evidenceReference: {
      title: 'EvidenceReference',
      properties: {
        resource: { $ref: '#/definitions/uri' }, //subject
        attribution: { $ref: '#/definitions/attribution' },
      },
      required: ['resource'],
    },
    onlineAccount: {
      type: 'object',
      properties: {
        serviceHomepage: { $ref: '#/definitions/resourceReference' },
        accountName: { type: 'string' },
      },
      required: ['serviceHomepage', 'accountName'],
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
        street6: { type: 'string' },
      },
    },
    conclusion: {
      type: 'object',
      title: 'Conclusion',
      properties: {
        id: {
          type: 'string',
          description: 'An identifier for the conclusion data.',
        },
        lang: {
          $ref: '#/definitions/localeTag',
          description: 'The locale identifier for the conclusion.',
        },
        sources: {
          items: { $ref: '#/definitions/sourceReference' },
          description:
            'The list of references to the sources of related to this conclusion.',
        },
        analysis: {
          $ref: '#/definitions/resourceReference',
          description:
            'Reference to a document containing analysis supporting this conclusion.',
        },
        notes: {
          items: { $ref: '#/definitions/note' },
          description: 'A list of notes about this conclusion.',
        },
        confidence: {
          anyOf: [
            { $ref: '#/definitions/uri' },
            { $ref: '#/definitions/confidenceTypes' },
          ],
          description: 'Reference to a confidence level for this conclusion.',
        },
        attribution: {
          $ref: '#/definitions/attribution',
          description: 'The attribution of this conclusion.',
        },
      },
    },
    subject: {
      title: 'Subject',
      allOf: [
        { $ref: '#/definitions/conclusion' },
        {
          properties: {
            extracted: {
              type: 'boolean',
              description:
                'Whether this subject is to be constrained as an extracted conclusion.',
            },
            evidence: {
              items: { $ref: '#/definitions/evidenceReference' },
              description:
                'References to other subjects that support this subject.',
            },
            media: {
              items: { $ref: '#/definitions/sourceReference' },
              description:
                'References to multimedia resources for this subject, such as photos or videos, intended to provide additional context or illustration for the subject and not considered evidence supporting the identity of the subject or its supporting conclusions.',
            },
            identifiers: {
              $ref: '#/definitions/identifier',
              description: 'A list of identifiers for the subject.',
            },
          },
        },
      ],
    },
    gender: {
      allOf: [
        { $ref: '#/definitions/conclusion' },
        {
          properties: {
            type: {
              anyOf: [
                { $ref: '#/definitions/uri' },
                { $ref: '#/definitions/genderTypes' },
              ],
              description: 'Enumerated value identifying the gender.',
            },
          },
          required: ['type'],
        },
      ],
    },
    date: {
      type: 'object',
      properties: {
        original: {
          type: 'string',
          description:
            'The original value of the date as supplied by the contributor.',
        },
        formal: {
          type: 'string',
          pattern:
            '^(A?[\\+-]\\d{4}(-\\d{2})?(-\\d{2})?T?(\\d{2})?(:\\d{2})?(:\\d{2})?([\\+-]\\d{2}(:\\d{2})?|Z)?)|(P(\\d{0,4}Y)?(\\d{0,4}M)?(\\d{0,4}D)?(T(\\d{0,4}H)?(\\d{0,4}M)?(\\d{0,4}S)?)?)$',
          description:
            'The standardized formal value of the date, formatted according to the GEDCOM X Date Format specification.',
        },
      },
    },
    name: {
      title: 'Name',
      allOf: [
        { $ref: '#/definitions/conclusion' },
        {
          properties: {
            type: {
              anyOf: [
                { $ref: '#/definitions/uri' },
                { $ref: '#/definitions/nameTypes' },
              ],
              description: 'Enumerated value identifying the name type.',
            },
            date: {
              $ref: '#/definitions/date',
              description: 'The date of applicability of the name.',
            },
            nameForms: {
              items: {
                $ref: '#/definitions/nameForm',
              },
              description:
                "The name form(s) that best express this name, usually representations considered proper and well formed in the person's native, historical cultural context.",
            },
          },
          required: ['nameForms'],
        },
      ],
    },
    namePart: {
      title: 'NamePart',
      description:
        'The NamePart data type is used to model a portion of a full name, including the terms that make up that portion. Some name parts may have qualifiers to provide additional semantic meaning to the name part (e.g., "given name" or "surname").',
      properties: {
        type: {
          anyOf: [
            { $ref: '#/definitions/uri' },
            { $ref: '#/definitions/namePartTypes' },
          ],
          description:
            'Enumerated value identifying the type of the name part.',
        },
        value: {
          type: 'string',
          description: 'The term(s) from the name that make up this name part.',
        },
        qualifiers: {
          items: { $ref: '#/definitions/namePartQualifier' },
          description:
            'Qualifiers to add additional semantic meaning to the name part.',
        },
      },
      required: ['value'],
    },
    namePartQualifier: {
      properties: {
        name: {
          anyOf: [
            { $ref: '#/definitions/namePartQualifierNames' },
            { $ref: '#/definitions/uri' },
          ],
        },
        value: { type: 'string' },
      },
      required: ['name'],
    },
    namePartQualifierNames: {
      enum: [
        'http://gedcomx.org/Title', //A designation for honorifics (e.g. Dr., Rev., His Majesty, Haji), ranks (e.g. Colonel, General, Knight, Esquire), positions (e.g. Count, Chief, Father, King) or other titles (e.g., PhD, MD). Name part qualifiers of type Title SHOULD NOT provide a value.
        'http://gedcomx.org/Primary', //A designation for the name of most prominent in importance among the names of that type (e.g., the primary given name). Name part qualifiers of type Primary SHOULD NOT provide a value.
        'http://gedcomx.org/Secondary', //A designation for a name that is not primary in its importance among the names of that type (e.g., a secondary given name). Name part qualifiers of type Secondary SHOULD NOT provide a value.
        'http://gedcomx.org/Middle', //A designation useful for cultures that designate a middle name that is distinct from a given name and a surname. Name part qualifiers of type Middle SHOULD NOT provide a value.
        'http://gedcomx.org/Familiar', //A designation for one's familiar name. Name part qualifiers of type Familiar SHOULD NOT provide a value.
        'http://gedcomx.org/Religious', //A designation for a name given for religious purposes. Name part qualifiers of type Religious SHOULD NOT provide a value.
        'http://gedcomx.org/Family', //A name that associates a person with a group, such as a clan, tribe, or patriarchal hierarchy. Name part qualifiers of type Family SHOULD NOT provide a value.
        'http://gedcomx.org/Maiden', //A designation given by women to their original surname after they adopt a new surname upon marriage. Name part qualifiers of type Maiden SHOULD NOT provide a value.
        'http://gedcomx.org/Patronymic', //A name derived from a father or paternal ancestor. Name part qualifiers of type Patronymic SHOULD NOT provide a value.
        'http://gedcomx.org/Matronymic', //A name derived from a mother or maternal ancestor. Name part qualifiers of type Matronymic SHOULD NOT provide a value.
        'http://gedcomx.org/Geographic', //A name derived from associated geography. Name part qualifiers of type Geographic SHOULD NOT provide a value.
        'http://gedcomx.org/Occupational', //A name derived from one's occupation. Name part qualifiers of type Occupational SHOULD NOT provide a value.
        'http://gedcomx.org/Characteristic', //A name derived from a characteristic. Name part qualifiers of type Characteristic SHOULD NOT provide a value.
        'http://gedcomx.org/Postnom', //A name mandated by law for populations from Congo Free State / Belgian Congo / Congo / Democratic Republic of Congo (formerly Zaire). Name part qualifiers of type Postnom SHOULD NOT provide a value.
        'http://gedcomx.org/Particle', //A grammatical designation for articles (a, the, dem, las, el, etc.), prepositions (of, from, aus, zu, op, etc.), initials, annotations (e.g. twin, wife of, infant, unknown), comparators (e.g. Junior, Senior, younger, little), ordinals (e.g. III, eighth), descendancy words (e.g. ben, ibn, bat, bin, bint, bar), and conjunctions (e.g. and, or, nee, ou, y, o, ne, &). Name part qualifiers of type Particle SHOULD NOT provide a value.
        'http://gedcomx.org/RootName', //The "root" of a name part as distinguished from prefixes or suffixes. For example, the root of the Polish name "Wilkówna" is "Wilk". A RootName qualifier MUST provide a value property.
      ],
    },
    nameForm: {
      title: 'NameForm',
      description: `The NameForm data type defines a representation of a name (a "name form") within a given cultural context, such as a given language and script.
      As names are captured (both in records or in applications), the terms in the name are sometimes classified by type. For example, a certificate of death might prompt for "given name(s)" and "surname". The parts list can be used to represent the terms in the name that have been classified.
      If both a full rendering of the name and a list of parts are provided, it NOT REQUIRED that every term in the fully rendered name appear in the list of parts.
      Name parts in the parts list SHOULD be ordered in the natural order they would be used in the applicable cultural context.
      If a full rendering of the name is not provided (i.e., the name has only been expressed in parts), a full rendering of the name MAY be derived (sans punctuation) by concatenating, in order, each name part value in the list of parts, separating each part with the name part separator appropriate for the applicable cultural context.`,
      properties: {
        lang: {
          $ref: '#/definitions/localeTag',
          description: 'The locale identifier for the name form.',
        },
        fullText: {
          type: 'string',
          description:
            'A full rendering of the name (or as much of the name as is known).',
        },
        parts: {
          items: {
            $ref: '#/definitions/namePart',
          },
          description: 'Any identified name parts from the name.',
        },
      },
    },
    fact: {
      title: 'PersonFact',
      allOf: [
        { $ref: '#/definitions/conclusion' },
        {
          properties: {
            type: {
              anyOf: [
                { $ref: '#/definitions/uri' },
                { $ref: '#/definitions/personFactTypes' },
              ],
              description: 'Enumerated value identifying the type of the fact.',
            },
            date: {
              $ref: '#/definitions/date',
              description: 'The date of applicability of the fact.',
            },
            place: {
              $ref: '#/definitions/placeReference',
              description: 'A reference to the place applicable to this fact.',
            },
            value: { type: 'string', description: 'The value of the fact.' },
            qualifiers: {
              items: { $ref: '#/definitions/factQualifier' },
              description:
                'Qualifiers to add additional details about the fact.',
            },
          },
          required: ['type'],
        },
      ],
    },
    factQualifier: {
      properties: {
        name: {
          anyOf: [
            { $ref: '#/definitions/factQualifierNames' },
            { $ref: '#/definitions/uri' },
          ],
        },
        value: { type: 'string' },
      },
      required: ['name'],
    },
    factQualifierNames: {
      enum: [
        'http://gedcomx.org/Age',
        'http://gedcomx.org/Cause',
        'http://gedcomx.org/Religion',
        'http://gedcomx.org/Transport',
        'http://gedcomx.org/NonConsensual',
      ],
    },
    eventRole: {
      allOf: [
        { $ref: '#/definitions/conclusion' },
        {
          properties: {
            person: {
              $ref: '#/definitions/resourceReference',
              description: 'Reference to the event participant.',
            },
            type: {
              anyOf: [
                { $ref: '#/definitions/uri' },
                { $ref: '#/definitions/eventRoleTypes' },
              ],
              description:
                "Enumerated value identifying the participant's role.",
            },
            details: {
              type: 'string',
              description:
                'Details about the role of participant in the event.',
            },
          },
          required: ['person'],
        },
      ],
    },
    eventRoleTypes: {
      enum: [
        'http://gedcomx.org/Principal',
        'http://gedcomx.org/Participant',
        'http://gedcomx.org/Official',
        'http://gedcomx.org/Witness',
      ],
    },
    placeReference: {
      type: 'object',
      properties: {
        original: {
          type: 'string',
          description:
            'The original place name text as supplied by the contributor.',
        },
        description: {
          $ref: '#/definitions/uri',
          description: 'A reference to a description of this place.',
        },
      },
    },
    coverage: {
      properties: {
        spatial: {
          $ref: '#/definitions/placeReference',
          description: 'The spatial (i.e., geographic) coverage.',
        },
        temporal: {
          $ref: '#/definitions/date',
          description: 'The temporal coverage.',
        },
      },
    },
    groupRole: {
      allOf: [
        { $ref: '#/definitions/conclusion' },
        {
          properties: {
            person: {
              $ref: '#/definitions/resourceReference',
              description: 'Reference to the group participant.',
            },
            type: {
              $ref: '#/definitions/uri',
              description:
                "Enumerated value identifying the participant's role.",
            },
            date: {
              $ref: '#/definitions/date',
              description: 'The date of applicability of the role.',
            },
            details: {
              type: 'string',
              description:
                'Details about the role of he participant in the group.',
            },
          },
          required: ['person'],
        },
      ],
    },
    person: {
      title: 'Person',
      allOf: [
        { $ref: '#/definitions/subject' },
        {
          properties: {
            private: {
              type: 'boolean',
              description:
                'Whether this instance of Person has been designated for limited distribution or display.',
            },
            gender: {
              $ref: '#/definitions/gender',
              description: 'The sex of the person as assigned at birth.',
            },
            names: {
              items: { $ref: '#/definitions/name' },
              description: 'The names of the person.',
            },
            facts: {
              items: { $ref: '#/definitions/fact' },
              description: 'The facts of the person.',
            },
          },
        },
      ],
    },
    relationship: {
      allOf: [
        { $ref: '#/definitions/subject' },
        {
          properties: {
            type: {
              anyOf: [
                { $ref: '#/definitions/relationshipType' },
                { $ref: '#/definitions/uri' },
              ],
              description:
                'Enumerated value identifying the type of the relationship.',
            },
            person1: {
              $ref: '#/definitions/resourceReference',
              description: 'Reference to the first person in the relationship.',
            },
            person2: {
              $ref: '#/definitions/resourceReference',
              description:
                'Reference to the second person in the relationship.',
            },
            facts: {
              items: { $ref: '#/definitions/fact' },
              description: 'The facts about the relationship.',
            },
          },
          required: ['person1', 'person2'],
        },
      ],
    },
    relationshipType: {
      enum: [
        'http://gedcomx.org/Couple', //	A relationship of a pair of persons.
        'http://gedcomx.org/ParentChild', //	A relationship from a parent to a child.
        'http://gedcomx.org/EnslavedBy', //	A relationship from an enslaved person to the enslaver or slaveholder of the person.
      ],
    },
    sourceDescription: {
      title: 'SourceDescription',
      properties: {
        id: {
          type: 'string',
          description:
            'An identifier for the data structure holding the source description data.',
        },
        resourceType: {
          anyOf: [
            { $ref: '#/definitions/resourceTypes' },
            { $ref: '#/definitions/uri' },
          ],
          description:
            'Enumerated value identifying the type of resource being described.',
        },
        citations: {
          items: { $ref: '#/definitions/sourceCitation' },
          description: 'The citation(s) for this source.',
        },
        mediaType: {
          type: 'string',
          description:
            'A hint about the media type of the resource being described.',
        },
        about: {
          $ref: '#/definitions/uri',
          description:
            'A uniform resource identifier (URI) for the resource being described.',
        },
        mediator: {
          $ref: '#/definitions/resourceReference',
          description:
            'A reference to the entity that mediates access to the described source.',
        },
        publisher: {
          $ref: '#/definitions/resourceReference',
          description:
            'A reference to the entity responsible for making the described source available.',
        },
        sources: {
          items: { $ref: '#/definitions/sourceReference' },
          description:
            'A list of references to any sources from which this source is derived.',
        },
        analysis: {
          $ref: '#/definitions/resourceReference',
          description:
            'A reference to a document containing analysis about this source.',
        },
        componentOf: {
          $ref: '#/definitions/sourceReference',
          description:
            'A reference to the source that contains this source, i.e. its parent context. Used when the description of a source is not complete without the description of its parent (or containing) source.',
        },
        titles: {
          items: { $ref: '#/definitions/textValue' },
          description: 'The display name(s) for this source.',
        },
        notes: {
          items: { $ref: '#/definitions/note' },
          description: 'A list of notes about a source.',
        },
        attribution: {
          $ref: '#/definitions/attribution',
          description: 'The attribution of this source description.',
        },
        rights: {
          items: { $ref: '#/definitions/resourceReference' },
          description: 'The rights for this resource.',
        },
        coverage: {
          $ref: '#/definitions/coverage',
          description: 'The coverage of the resource.',
        },
        descriptions: {
          items: { $ref: '#/definitions/textValue' },
          description: 'Human-readable descriptions of this source.',
        },
        identifiers: {
          items: { $ref: '#/definitions/identifier' },
          description:
            'A list of identifiers for the resource being described.',
        },
        created: {
          type: 'number',
          description:
            'Timestamp of when the resource being described was created.',
        },
        modified: {
          type: 'number',
          description:
            'Timestamp of when the resource being described was modified.',
        },
        repository: {
          $ref: '#/definitions/resourceReference',
          description:
            'A reference to the repository that contains the described resource.',
        },
      },
      required: ['citations'],
    },
    resourceTypes: {
      enum: [
        'http://gedcomx.org/Collection', //A collection of genealogical resources. A collection may contain physical artifacts (such as a collection of books in a library), records (such as the 1940 U.S. Census), or digital artifacts (such as an online genealogical application).
        'http://gedcomx.org/PhysicalArtifact', //A physical artifact, such as a book.
        'http://gedcomx.org/DigitalArtifact', //A digital artifact, such as a digital image of a birth certificate or other record.
        'http://gedcomx.org/Record', //A historical record, such as a census record or a vital record.
      ],
    },
    agent: {
      title: 'Agent',
      properties: {
        id: { type: 'string' },
        identifiers: {
          type: 'array',
          items: { $ref: '#/definitions/identifier' },
        },
        names: {
          type: 'array',
          items: { $ref: '#/definitions/textValue' },
        },
        homepage: { $ref: '#/definitions/resourceReference' },
        openid: { $ref: '#/definitions/resourceReference' },
        accounts: {
          type: 'array',
          items: { $ref: '#/definitions/onlineAccount' },
        },
        emails: {
          type: 'array',
          items: { $ref: '#/definitions/resourceReference' },
        },
        phones: {
          type: 'array',
          items: { $ref: '#/definitions/resourceReference' },
        },
        addresses: {
          type: 'array',
          items: { $ref: '#/definitions/address' },
        },
        person: {
          $ref: '#/definitions/resourceReference',
        },
      },
    },
    event: {
      allOf: [
        { $ref: '#/definitions/subject' },
        {
          properties: {
            type: {
              anyOf: [
                { $ref: '#/definitions/eventTypes' },
                { $ref: '#/definitions/uri' },
              ],
            },
            date: { $ref: '#/definitions/date' },
            place: { $ref: '#/definitions/placeReference' },
            roles: {
              type: 'array',
              items: { $ref: '#/definitions/eventRole' },
            },
          },
        },
      ],
    },
    eventTypes: {
      enum: [
        'http://gedcomx.org/Adoption', //An adoption event.
        'http://gedcomx.org/AdultChristening', //An adult christening event.
        'http://gedcomx.org/Annulment', //An annulment event of a marriage.
        'http://gedcomx.org/Baptism', //A baptism event.
        'http://gedcomx.org/BarMitzvah', //A bar mitzvah event.
        'http://gedcomx.org/BatMitzvah', //A bat mitzvah event.
        'http://gedcomx.org/Birth', //A birth event.
        'http://gedcomx.org/Blessing', //A an official blessing event, such as at the hands of a clergy member or at another religious rite.
        'http://gedcomx.org/Burial', //A burial event.
        'http://gedcomx.org/Census', //A census event.
        'http://gedcomx.org/Christening', //A christening event at birth. Note: use AdultChristening for a christening event as an adult.
        'http://gedcomx.org/Circumcision', //A circumcision event.
        'http://gedcomx.org/Confirmation', //A confirmation event (or other rite of initiation) in a church or religion.
        'http://gedcomx.org/Cremation', //A cremation event after death.
        'http://gedcomx.org/Death', //A death event.
        'http://gedcomx.org/Divorce', //A divorce event.
        'http://gedcomx.org/DivorceFiling', //A divorce filing event.
        'http://gedcomx.org/Education', //A education or an educational achievement event (e.g. diploma, graduation, scholarship, etc.).
        'http://gedcomx.org/Engagement', //An engagement to be married event.
        'http://gedcomx.org/Emigration', //An emigration event.
        'http://gedcomx.org/Excommunication', //An excommunication event from a church.
        'http://gedcomx.org/FirstCommunion', //A first communion event.
        'http://gedcomx.org/Funeral', //A funeral event.
        'http://gedcomx.org/Immigration', //An immigration event.
        'http://gedcomx.org/LandTransaction', //A land transaction event.
        'http://gedcomx.org/Marriage', //A marriage event.
        'http://gedcomx.org/MilitaryAward', //A military award event.
        'http://gedcomx.org/MilitaryDischarge', //A military discharge event.
        'http://gedcomx.org/Mission', //A mission event.
        'http://gedcomx.org/MoveFrom', //An event of a move (i.e. change of residence) from a location.
        'http://gedcomx.org/MoveTo', //An event of a move (i.e. change of residence) to a location.
        'http://gedcomx.org/Naturalization', //A naturalization event (i.e. acquisition of citizenship and nationality).
        'http://gedcomx.org/Ordination', //An ordination event.
        'http://gedcomx.org/Retirement', //A retirement event.
      ],
    },
    document: {
      title: 'Document',
      allOf: [
        { $ref: '#/definitions/conclusion' },
        {
          properties: {
            type: {
              anyOf: [
                { $ref: '#/definitions/documentTypes' },
                { $ref: '#/definitions/uri' },
              ],
            },
            extracted: { type: 'boolean' },
            textType: { type: 'string' },
            text: { type: 'string' },
            attribution: { $ref: '#/definitions/attribution' },
          },
          required: ['text'],
        },
      ],
    },
    documentTypes: {
      enum: [
        'http://gedcomx.org/Abstract', //The document is an abstract of a record or document.
        'http://gedcomx.org/Transcription', //The document is a transcription of a record or document.
        'http://gedcomx.org/Translation', //The document is a translation of a record or document.
        'http://gedcomx.org/Analysis', //The document is an analysis done by a researcher; a genealogical proof statement is an example of one kind of analysis document.
      ],
    },
    placeDescription: {
      title: 'PlaceDescription',
      allOf: [
        { $ref: '#/definitions/subject' },
        {
          properties: {
            names: {
              items: { $ref: '#/definitions/textValue' },
            },
            type: { $ref: '#/definitions/uri' },
            place: { $ref: '#/definitions/resourceReference' },
            jurisdiction: {
              $ref: '#/definitions/resourceReference',
            },
            latitude: { type: 'number' },
            longitude: { type: 'number' },
            temporalDescription: { $ref: '#/definitions/date' },
            spatialDescription: { $ref: '#/definitions/resourceReference' },
          },
          required: ['names'],
        },
      ],
    },
    group: {
      allOf: [
        { $ref: '#/definitions/subject' },
        {
          properties: {
            names: {
              type: 'array',
              items: { $ref: '#/definitions/textValue' },
            },
            date: { $ref: '#/definitions/date' },
            place: { $ref: '#/definitions/resourceReference' },
            roles: {
              type: 'array',
              items: { $ref: '#/definitions/groupRole' },
            },
          },
          required: ['names'],
        },
      ],
    },
  },

  type: 'object',
  properties: {
    persons: {
      type: 'array',
      items: { $ref: '#/definitions/person' },
    },
    relationships: {
      type: 'array',
      items: { $ref: '#/definitions/relationship' },
    },
    sourceDescriptions: {
      type: 'array',
      items: { $ref: '#/definitions/sourceDescription' },
    },
    agents: {
      type: 'array',
      items: { $ref: '#/definitions/agent' },
    },
    events: {
      type: 'array',
      items: { $ref: '#/definitions/event' },
    },
    documents: {
      type: 'array',
      items: { $ref: '#/definitions/document' },
    },
    places: {
      type: 'array',
      items: { $ref: '#/definitions/placeDescription' },
    },
    groups: {
      type: 'array',
      items: { $ref: '#/definitions/group' },
    },
    description: { $ref: '#/definitions/uri' },
    id: { type: 'string' },
    lang: { $ref: '#/definitions/localeTag' },
    attribution: { $ref: '#/definitions/attribution' },
  },
};

const data: any = {
  attribution: {
    contributor: {
      resource: '#A-1',
    },
    modified: 1398405600000,
  },
  persons: [
    {
      names: [
        {
          nameForms: [
            {
              fullText: 'Samuel Ham',
            },
          ],
        },
      ],
      gender: {
        type: 'http://gedcomx.org/Male',
      },
      facts: [
        {
          type: 'http://gedcomx.org/Residence',
          date: {
            original: '3 November 1828',
            formal: '+1828-11-03',
          },
          place: {
            original: 'parish of Honiton, Devon, England',
          },
        },
      ],
      extracted: true,
      sources: [
        {
          description: '#S-2',
        },
      ],
      id: 'P-1',
    },
    {
      names: [
        {
          nameForms: [
            {
              fullText: 'Elizabeth Spiller',
            },
          ],
        },
      ],
      gender: {
        type: 'http://gedcomx.org/Female',
      },
      facts: [
        {
          type: 'http://gedcomx.org/Residence',
          date: {
            original: '3 November 1828',
            formal: '+1828-11-03',
          },
          place: {
            original: 'parish of Wilton, Somerset, England',
          },
        },
      ],
      extracted: true,
      sources: [
        {
          description: '#S-2',
        },
      ],
      id: 'P-2',
    },
    {
      names: [
        {
          nameForms: [
            {
              fullText: 'Jno. Pain',
            },
          ],
        },
      ],
      extracted: true,
      sources: [
        {
          description: '#S-2',
        },
      ],
      id: 'P-3',
    },
    {
      names: [
        {
          nameForms: [
            {
              fullText: 'R.G. Halls',
            },
          ],
        },
      ],
      extracted: true,
      sources: [
        {
          description: '#S-2',
        },
      ],
      id: 'P-4',
    },
    {
      names: [
        {
          nameForms: [
            {
              fullText: 'Peggy Hammet',
            },
          ],
        },
      ],
      extracted: true,
      sources: [
        {
          description: '#S-2',
        },
      ],
      id: 'P-5',
    },
    {
      names: [
        {
          nameForms: [
            {
              fullText: 'David Smith Stone',
            },
          ],
        },
      ],
      extracted: true,
      sources: [
        {
          description: '#S-2',
        },
      ],
      id: 'P-6',
    },
    {
      evidence: [
        {
          resource: '#P-1',
        },
      ],
      analysis: {
        resource: '#D-2',
      },
      id: 'C-1',
    },
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
            formal: '+1828-11-03',
          },
          place: {
            original: 'Wilton St George, Wilton, Somerset, England',
          },
        },
      ],
      person1: {
        resource: '#P-1',
      },
      person2: {
        resource: '#P-2',
      },
    },
  ],
  sourceDescriptions: [
    {
      description: [
        {
          value:
            'Marriage entry for Samuel Ham and Elizabeth in a copy of the registers of the baptisms, marriages, and burials at the church of St. George in the parish of Wilton : adjoining Taunton, in the county of Somerset from A.D. 1558 to A.D. 1837.',
        },
      ],
      resourceType: 'http://gedcomx.org/PhysicalArtifact',
      citations: [
        {
          value:
            'Joseph Houghton Spencer, transcriber, Church of England, Parish Church of Wilton (Somerset). A copy of the registers of the baptisms, marriages, and burials at the church of St. George in the parish of Wilton : adjoining Taunton, in the county of Somerset from A.D. 1558 to A.D. 1837; Marriage entry for Samuel Ham and Elizabeth Spiller (3 November 1828), (Taunton: Barnicott, 1890), p. 224, No. 86.',
        },
      ],
      titles: [
        {
          value:
            'Marriage entry for Samuel Ham and Elizabeth Spiller, Parish Register, Wilton, Somerset, England',
        },
      ],
      repository: {
        resource: '#A-2',
      },
      id: 'S-1',
    },
    {
      description: [
        {
          value:
            'Transcription of marriage entry for Samuel Ham and Elizabeth in a copy of the registers of the baptisms, marriages, and burials at the church of St. George in the parish of Wilton : adjoining Taunton, in the county of Somerset from A.D. 1558 to A.D. 1837.',
        },
      ],
      sources: [
        {
          description: '#S-1',
        },
      ],
      resourceType: 'http://gedcomx.org/DigitalArtifact',
      citations: [
        {
          value:
            'Joseph Houghton Spencer, transcriber, Church of England, Parish Church of Wilton (Somerset). A copy of the registers of the baptisms, marriages, and burials at the church of St. George in the parish of Wilton : adjoining Taunton, in the county of Somerset from A.D. 1558 to A.D. 1837; Marriage entry for Samuel Ham and Elizabeth Spiller (3 November 1828), (Taunton: Barnicott, 1890), p. 224, No. 86.',
        },
      ],
      about: '#D-1',
      titles: [
        {
          value:
            'Transcription of marriage entry for Samuel Ham and Elizabeth Spiller, Parish Register, Wilton, Somerset, England',
        },
      ],
      id: 'S-2',
    },
  ],
  agents: [
    {
      names: [
        {
          value: 'Jane Doe',
        },
      ],
      emails: [
        {
          resource: 'mailto:example@example.org',
        },
      ],
      id: 'A-1',
    },
    {
      names: [
        {
          value: 'Family History Library',
        },
      ],
      addresses: [
        {
          city: 'Salt Lake City',
          stateOrProvince: 'Utah',
        },
      ],
      id: 'A-2',
    },
  ],
  events: [
    {
      type: 'http://gedcomx.org/Marriage',
      date: {
        original: '3 November 1828',
        formal: '+1828-11-03',
      },
      place: {
        original: 'Wilton St George, Wilton, Somerset, England',
      },
      roles: [
        {
          type: 'http://gedcomx.org/Principal',
          person: {
            resource: '#P-1',
          },
        },
        {
          type: 'http://gedcomx.org/Principal',
          person: {
            resource: '#P-2',
          },
        },
        {
          type: 'http://gedcomx.org/Witness',
          person: {
            resource: '#P-3',
          },
        },
        {
          type: 'http://gedcomx.org/Witness',
          person: {
            resource: '#P-4',
          },
        },
        {
          type: 'http://gedcomx.org/Witness',
          person: {
            resource: '#P-5',
          },
        },
        {
          type: 'http://gedcomx.org/Official',
          person: {
            resource: '#P-6',
          },
        },
      ],
      extracted: true,
      id: 'E-1',
    },
  ],
  documents: [
    {
      type: 'http://gedcomx.org/Transcription',
      text: 'Samuel Ham of the parish of Honiton and Elizabeth Spiller\nwere married this 3rd day of November 1828 by David Smith\nStone, Pl Curate,\nIn the Presence of\nJno Pain.\nR.G. Halls.  Peggy Hammet.\nNo. 86.',
      sources: [
        {
          description: '#S-1',
        },
      ],
      lang: 'en',
      id: 'D-1',
    },
    {
      text: '...Jane Doe`s analysis document...',
      id: 'D-2',
    },
  ],
};

export const uischema: any = {
  type: 'Categorization',
  elements: [
    {
      type: 'Category',
      label: 'Persons',
      elements: [{ type: 'ListWithDetail', scope: '#/properties/persons' }],
    },
    {
      type: 'Category',
      label: 'Relationships',
      elements: [
        { type: 'ListWithDetail', scope: '#/properties/relationships' },
      ],
    },
    {
      type: 'Category',
      label: 'SourceDescriptions',
      elements: [
        { type: 'ListWithDetail', scope: '#/properties/sourceDescriptions' },
      ],
    },
    {
      type: 'Category',
      label: 'Agents',
      elements: [{ type: 'ListWithDetail', scope: '#/properties/agents' }],
    },
    {
      type: 'Category',
      label: 'Events',
      elements: [{ type: 'ListWithDetail', scope: '#/properties/events' }],
    },
    {
      type: 'Category',
      label: 'Documents',
      elements: [{ type: 'ListWithDetail', scope: '#/properties/documents' }],
    },
    {
      type: 'Category',
      label: 'Places',
      elements: [{ type: 'ListWithDetail', scope: '#/properties/places' }],
    },
    {
      type: 'Category',
      label: 'Generic',
      elements: [
        { type: 'Control', scope: '#/properties/description' },
        { type: 'Control', scope: '#/properties/lang' },
        { type: 'Control', scope: '#/properties/attribution' },
        { type: 'Control', scope: '#/properties/id' },
      ],
    },
  ],
};

registerExamples([
  {
    name: 'huge',
    label: 'Huge Test',
    data,
    schema,
    uischema,
  },
]);

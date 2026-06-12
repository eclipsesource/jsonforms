import type { JsonSchemaExample } from '../types';

/**
 * Declares the 2020-12 dialect via `$schema` and uses `dependentRequired`,
 * which draft-07 validators do not know — the demo apps' AJV validator picks
 * the matching AJV build from the declared dialect.
 */
export const dialect2020: JsonSchemaExample = {
  id: 'dialect-2020',
  title: 'JSON Schema 2020-12',
  description:
    'This schema declares the 2020-12 dialect and uses dependentRequired: entering a card number makes the billing address required. The AJV validator picks the 2020-12 build based on the declared $schema.',
  schema: {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    type: 'object',
    title: 'Payment',
    properties: {
      cardNumber: {
        type: 'string',
        title: 'Card Number',
        pattern: '^[0-9]{12,19}$',
        description: '12 to 19 digits — makes the billing address required',
      },
      billingAddress: {
        type: 'string',
        title: 'Billing Address',
      },
      receiptByMail: {
        type: 'boolean',
        title: 'Send receipt by mail',
      },
    },
    dependentRequired: {
      cardNumber: ['billingAddress'],
    },
  },
  uischema: {
    type: 'VerticalLayout',
    elements: [
      { type: 'Control', scope: '#/properties/cardNumber' },
      { type: 'Control', scope: '#/properties/billingAddress' },
      { type: 'Control', scope: '#/properties/receiptByMail' },
    ],
  },
  data: {
    cardNumber: '4242424242424242',
  },
};

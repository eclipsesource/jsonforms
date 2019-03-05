export default {
  $id: 'https://example.com/geographical-location.schema.json',
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'Longitude and Latitude Values',
  description: 'A geographical coordinate.',
  required: ['latitude', 'longitude'],
  type: 'object',
  properties: {
    latitude: {
      type: 'number',
      minimum: -90,
      maximum: 90
    },
    longitude: {
      type: 'number',
      minimum: -180,
      maximum: 180
    }
  }
} as any;

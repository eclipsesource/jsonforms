export default angular.module('jsonforms-examples.generate-uischema', [])
  .value('generate-uischema.schema',
    {
      'type': 'object',
      'properties': {
        'name': {
          'type': 'string'
        },
        'age': {
          'type': 'integer'
        }
      }
    }
  )
  .value('generate-uischema.uischema', undefined)
  .value('generate-uischema.data',
    {
      name: 'John Doe',
      age: 36
    }
  )
.name;

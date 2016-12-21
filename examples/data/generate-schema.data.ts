export default angular.module('jsonforms-examples.generate-schema', [])
  .value('generate-schema.schema', undefined)
  .value('generate-schema.uischema', undefined)
  .value('generate-schema.data',
    {
      name: 'John Doe',
      age: 36
    }
  )
.name;

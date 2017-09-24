import test from 'ava';
import { JsonForms } from '../src/core';
import { testDataSchema } from './data/modelreference.data';
import { SchemaService } from '../src/core/schema.service';
import { SchemaServiceImpl } from '../src/core/schema.service.impl';

test.beforeEach(t => {

  const classA = {
    'eClass': 'http://www.eclipse.org/emf/2002/Ecore#//EClass',
    'name': 'classA',
    '_id' : 'id-class-a',
    'eStructuralFeatures': [
      {
        'eClass': 'http://www.eclipse.org/emf/2002/Ecore#//EAttribute',
        'eType': {},
        'name': 'attributeOne'
      },
      {
        'eClass': 'http://www.eclipse.org/emf/2002/Ecore#//EAttribute',
        'eType': {},
        'name': 'attributeTwo'
      },
      {
        'eClass': 'http://www.eclipse.org/emf/2002/Ecore#//EReference',
        'name': 'referenceOne',
        'eType': 'id-class-b'
      }
    ]
  };

  const classB = {
    'eClass': 'http://www.eclipse.org/emf/2002/Ecore#//EClass',
      'name': 'classB',
      '_id': 'id-class-b',
      'eStructuralFeatures': [
        {
          'eClass': 'http://www.eclipse.org/emf/2002/Ecore#//EAttribute',
          'eType': {},
          'name': 'attributeOne'
        },
      ]
  };

  const enumOne = {
     'eClass': 'http://www.eclipse.org/emf/2002/Ecore#//EEnum',
      'name': 'enumOne',
      '_id': 'id-enum-one',
      'eLiterals': [
          'enumLiteralOne', 'enumLiteralTwo', 'enumLiteralThree'
      ]
  };

  const dataTypeOne = {
    'eClass': 'http://www.eclipse.org/emf/2002/Ecore#//EDataType',
     'name': 'dataTypeOne',
     '_id': 'id-datatype-one',
     'instanceClassName' : 'dataTypeOne',
     'instanceTypeName' : 'java.lang.String'
  };

  t.context.candidates = [
      classA,
      classB,
      enumOne,
      dataTypeOne
    ];

  // data has to consist of a bunch of eClassifiers
  // so we can verify whether the filtering works
  t.context.data = {
    'name': 'packageOne',
    'eClassifiers': t.context.candidates
  };

  t.context.modelMapping = {
    'attribute': 'eClass',
    'mapping': {
      'http://www.eclipse.org/emf/2002/Ecore#//EEnum': '#enum',
      'http://www.eclipse.org/emf/2002/Ecore#//EClass': '#class',
      'http://www.eclipse.org/emf/2002/Ecore#//EDataType': '#datatype',
      'http://www.eclipse.org/emf/2002/Ecore#//EReference': '#reference',
      'http://www.eclipse.org/emf/2002/Ecore#//EAttribute': '#attribute'
    }
  };
  JsonForms.modelMapping = t.context.modelMapping;
  JsonForms.config.setIdentifyingProp('_id');

});

test('available options filtering for reference attribute candidates', t => {

  const matchingOptions = JsonForms.filterObjectsByType(t.context.candidates, '#class');

  t.is(Object.keys(matchingOptions).length, 2, 'array of length two expected');

});

test('available options filtering for reference attribute', t => {

  const service: SchemaService = new SchemaServiceImpl(testDataSchema);
  const reference = service.getReferenceProperties(testDataSchema.definitions.reference)[0];
  JsonForms.rootData = t.context.data;
  const availableOptions = reference.findReferenceTargets();
  console.log('availableOptions keys', Object.keys(availableOptions));
  t.is(Object.keys(availableOptions).length, 2, 'obect with two keys expected');
  t.is(Object.keys(availableOptions)[0], 'id-class-a');
  t.is(Object.keys(availableOptions)[1], 'id-class-b');

});

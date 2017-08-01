import test from 'ava';
import { JsonForms } from '../src/core';

test('get available options for reference attribute', t => {

    const classA = {
      "eClass": "http://www.eclipse.org/emf/2002/Ecore#//EClass",
      "name": "classA",
      "_id" : "id-class-a",
      "eStructuralFeatures": [
        {
          "eClass": "http://www.eclipse.org/emf/2002/Ecore#//EAttribute",
          "eType": {},
          "name": "attributeOne"
        },
        {
          "eClass": "http://www.eclipse.org/emf/2002/Ecore#//EAttribute",
          "eType": {},
          "name": "attributeTwo"
        },
        {
          "eClass": "http://www.eclipse.org/emf/2002/Ecore#//EReference",
          "name": "referenceOne",
          "eType": "id-class-b"
        }
      ]
    };

    const classB = {
      "eClass": "http://www.eclipse.org/emf/2002/Ecore#//EClass",
        "name": "classB",
        "_id": "id-class-B",
        "eStructuralFeatures": [
          {
            "eClass": "http://www.eclipse.org/emf/2002/Ecore#//EAttribute",
            "eType": {},
            "name": "attributeOne"
          },
        ]
    }

    const enumOne = {
      "eClass": "http://www.eclipse.org/emf/2002/Ecore#//EEnum",
        "name": "enumOne",
        "_id": "id-enum-one",
        "eLiterals": [
            "enumLiteralOne", "enumLiteralTwo", "enumLiteralThree"
        ]
    }

    const dataTypeOne = {
      "eClass": "http://www.eclipse.org/emf/2002/Ecore#//EDataType",
       "name": "dataTypeOne",
       "_id": "id-datatype-one",
       "instanceClassName" : "dataTypeOne",
       "instanceTypeName" : "java.lang.String"
    }

    // data has to consist of a bunch of eClassifiers
    // so we can verify whether the filtering works
    const data = {
      "name": "packageOne",
      "eClassifiers": [
        classA,
        classB,
        enumOne,
        dataTypeOne
      ]
    };

    JsonForms.modelMapping = {
      'attribute': 'eClass',
      'mapping': {
        'http://www.eclipse.org/emf/2002/Ecore#//EEnum': '#enum',
        'http://www.eclipse.org/emf/2002/Ecore#//EClass': '#class',
        'http://www.eclipse.org/emf/2002/Ecore#//EDataType': '#datatype',
        'http://www.eclipse.org/emf/2002/Ecore#//EReference': '#reference',
        'http://www.eclipse.org/emf/2002/Ecore#//EAttribute': '#attribute'
      }
    };
    const candidates = [
        classA,
        classB,
        enumOne,
        dataTypeOne
      ];

    // test filtering
    const matchingOptions = JsonForms.filterObjectsByType(candidates, "#class");
    t.is(Object.keys(matchingOptions).length, 2, "array of length two expected");

    // TODO: test retun of all available options
    // const allOptions = JsonForms.filterObjectsByType(candidates, null);
    // t.is(Object.keys(allOptions).length, 4, "array of length four expected");

});

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
const core_1 = require("../src/core");
const modelreference_data_1 = require("./helpers/modelreference.data");
const schema_service_impl_1 = require("../src/core/schema.service.impl");
ava_1.default.beforeEach(t => {
    const classA = {
        'eClass': 'http://www.eclipse.org/emf/2002/Ecore#//EClass',
        'name': 'classA',
        '_id': 'id-class-a',
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
        'instanceClassName': 'dataTypeOne',
        'instanceTypeName': 'java.lang.String'
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
    core_1.JsonForms.modelMapping = t.context.modelMapping;
});
ava_1.default('available options filtering for reference attribute candidates', t => {
    const matchingOptions = core_1.JsonForms.filterObjectsByType(t.context.candidates, '#class');
    t.is(Object.keys(matchingOptions).length, 2, 'array of length two expected');
});
ava_1.default('available options filtering for reference attribute', t => {
    const service = new schema_service_impl_1.SchemaServiceImpl(modelreference_data_1.testDataSchema);
    const reference = service.getReferenceProperties(modelreference_data_1.testDataSchema.definitions.reference)[0];
    const availableOptions = reference.findReferenceTargets(t.context.data);
    t.is(Object.keys(availableOptions).length, 2, 'array of length two expected');
});
//# sourceMappingURL=modelmapping.test.js.map
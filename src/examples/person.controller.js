'use strict';

var userDetailSchema = {
    "type": "VerticalLayout",
    "elements": [
        {
            "type": "HorizontalLayout",
            "elements": [
                {
                    "type": "Control",
                    "label": {
                        "text": "Name",
                        "show": true
                    },
                    "scope": {
                        "$ref": "#/properties/name"
                    },
                    "rule":{
                        "effect":"HIDE",
                        "condition":{
                            "type":"LEAF" ,
                            "scope": {
                                "$ref": "#/properties/personalData/properties/age"
                            },
                            "expectedValue":36
                        }
                    }
                },
                {
                    "type": "Control",
                    "label": {
                        "text": "Age"
                    },
                    "scope": {
                        "$ref": "#/properties/personalData/properties/age"
                    }
                },
                {
                    "type": "Control",
                    "label": "Birthday",
                    "scope": {
                        "$ref": "#/properties/birthDate"
                    }
                }
            ]
        },
        {
            "type": "Group",
            "label": "Additional",
            "elements": [
                {
                    "type": "Control",
                    "label": "Height",
                    "scope": {
                        "$ref": "#/properties/personalData/properties/height"
                    }
                },
                {
                    "type": "Control",
                    "label": "Vegetarian",
                    "scope": {
                        "$ref": "#/properties/vegetarian"
                    }
                },
                {
                    "type": "Control",
                    "label": "Nationality",
                    "scope": {
                        "$ref": "#/properties/nationality"
                    }
                },
                {
                    "type": "Control",
                    "label": "Occupation",
                    "scope": {
                        "$ref": "#/properties/occupation"
                    },
                    "suggestion": ["Accountant", "Engineer", "Freelancer", "Journalism", "Physician", "Student", "Teacher", "Other"]
                }
            ]
        }
    ]
};
var module = angular.module('examples.personcontroller',[]);

module.run(['UiSchemaRegistry', function(UiSchemaRegistry) {
    UiSchemaRegistry.register(userDetailSchema, function (schema){
        if(schema.properties.personalData===undefined) return -1;
        if(schema.properties.name===undefined) return -1;
        return 1;
    });
}]);
module.controller('PersonController',
['person.schema','person.uischema','person.data', function(Schema,UISchema,Data) {
    var vm = this;
    vm.schema = Schema;
    vm.uiSchema = UISchema;
    vm.data = Data;
}]);

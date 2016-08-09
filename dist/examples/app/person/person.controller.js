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
var app = angular.module('makeithappen');

app.run(['UiSchemaRegistry', function(UiSchemaRegistry) {
    UiSchemaRegistry.register(userDetailSchema, function (schema){
        if(schema.properties.personalData===undefined) return -1;
        if(schema.properties.name===undefined) return -1;
        return 1;
    });
}]);
angular.module('makeithappen').controller('PersonController', function() {
    var vm = this;
    vm.schema = {
        "type": "object",
        "properties": {
            "id": "user.json",
            "name": {
                "type": "string",
                "minLength": 3
            },
            "personalData": {
                "type": "object",
                "properties": {
                    "age": {
                        "type": "integer"
                    },
                    "height": {
                        "type": "number"
                    }
                },
                "required": ["age", "height"]
            },
            "vegetarian": {
                "type": "boolean"
            },
            "birthDate": {
                "type": "string",
                "format": "date-time"
            },
            "nationality": {
                "type": "string",
                "enum": ["DE", "IT", "JP", "US", "RU", "Other"]
            },
            "occupation": {
                "type": "string"
            },
            /* FIXME: disabling arrays for primitive types */
            /*"test_wrong": {
                "type": "array",
                "items": {"type":"string"}
            },*/
            "hobbies": {
                "type": "array",
                "items": {"type":"object","properties": {"name": {"type": "string"}}}
            }
        },
        "required": ["occupation", "nationality"]
    };
    vm.uiSchema = {
        "type": "VerticalLayout",
        "elements": [
            {
                "type": "VerticalLayout",
                "elements": [
                ],
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
                        "label": "Height",
                        "scope": {
                            "$ref": "#/properties/personalData/properties/height"
                        }
                    },
                  ]
                  },
                {
                  "type": "HorizontalLayout",
                  "elements": [
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
                    },
                    {
                        "type": "Control",
                        "label": "Birthday",
                        "scope": {
                            "$ref": "#/properties/birthDate"
                        }
                    }
                  ]
                }
              ]
            },
            {
                "type": "Categorization",
                "rule":{
                    "effect":"SHOW",
                    "condition":{
                        "type":"LEAF" ,
                        "scope": {
                            "$ref": "#/properties/personalData/properties/age"
                        },
                        "expectedValue":36
                    }
                },
                "elements": [
                    {
                        "type": "Category",
                        "label":"Private",
                        "elements": [
                            {
                                "type": "Control",
                                "label": "Name",
                                "scope": {
                                    "$ref": "#/properties/name"
                                }
                            },
                            {
                                "type": "Control",
                                "label": "Age",
                                "scope": {
                                    "$ref": "#/properties/personalData/properties/age"
                                }
                            }
                        ]
                    },
                    {
                        "type": "Category",
                        "label":"Additional",
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
                            }
                        ]
                    }
                ]
            }
        ]
    };

    vm.usersSchema = {
        "type": "object",
        "properties": {
            "users":{
                "type": "array",
                "items": vm.schema
            },
            "enemies":{
                "type": "array",
                "items": vm.schema
            }
        }
    };
    vm.usersUiSchema = {
        "type":"MasterDetailLayout",
        "scope": {
            "$ref": "#"
        }
    };
    vm.data = {
        name: 'John Doe',
        vegetarian: false,
        birthDate: "1985-06-02"
    };
    vm.users ={
        "users":
        [
            vm.data,
            {
                name: 'Todd',
                personalData:{age: 33}
            },
            {
                name: 'Jimmy',
                personalData:{age: 32}
            }
        ]
    };

    vm.formattedData = function() {
        return JSON.stringify(vm.users, null, 4);
    };
});

'use strict';

angular.module('makeithappen').controller('LocalController', function() {
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
            "test_wrong": {
                "type": "array",
                "items": {"type":"string"}
            },
            "test_correct": {
                "type": "array",
                "items": {"type":"object","properties": {"name": {"type": "string"}}}
            }
        },
        "required": ["occupation", "nationality"]
    };
    vm.uiSchema = {
        "type": "Group",
        "label": "This is a fancy label",
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
                "type": "HorizontalLayout",
                "elements": [
                    {
                        "type": "Control",
                        "label": "Name",
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
                        "label": "Age",
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
        birthDate: "02.06.1985"
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
            },
            {
                name: 'Max',
                personalData:{age: 35}
            },
            {
                name: 'Jonas',
                personalData:{age: 34}
            },
            {
                name: 'Edgar',
                personalData:{age: 30}
            },
            {
                name: 'Eugen',
                personalData:{age: 29}
            },
            {
                name: 'Johannes',
                personalData:{age: 26}
            },
            {
                name: 'Alex',
                personalData:{age: 25}
            },
            {
                name: 'Stefan',
                personalData:{age: 27}
            },
            {
                name: 'Eva',
                personalData:{age: 30}
            }
        ]
    };

    vm.formattedData = function() {
        return JSON.stringify(vm.users, null, 4);
    };
});

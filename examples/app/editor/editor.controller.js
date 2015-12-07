'use strict';

angular.module('makeithappen').controller('EditorController', function($scope) {

    var vm = this;

    $scope.aceLoaded = function(editor) {
        editor.$blockScrolling = Infinity;
        editor.getSession().setMode("ace/mode/javascript");
        editor.setOptions({
            enableSnippets: true,
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true
        });
    };

    // TODO: we currently don't $watch the schema
    $scope.schemaChanged = function(e) {
        vm.schema = JSON.parse(vm.localModel);
    };

    $scope.uiSchemaChanged = function(e) {
        vm.uiSchema = JSON.parse(vm.localView);
    };

    function replaceRefLinks(viewModelObject){
        for (var key in viewModelObject) {
            if (key == "feature") {
                var featureObject = viewModelObject[key];
                var pathObject = featureObject["path"];

                var refString = pathObject["$ref"];
                refString = refString.replace(new RegExp(escapeRegExp("/user-schema.json#/"), 'g'), "");
                featureObject["path"] = refString;

            }else if (viewModelObject[key] !== null && typeof(viewModelObject[key]) === "object"){
                replaceRefLinks(viewModelObject[key]);
            }
        }
    }

    vm.uiSchema = {

        "type": "HorizontalLayout",
        "elements": [
            {
                "type": "VerticalLayout",
                "elements": [
                    {
                        "type": "Label",
                        "text": "Personal Data"
                    },
                    {
                        "type": "Control",
                        "label": "First name",
                        "scope": {
                            "$ref": "#/properties/firstName"
                        }
                    },
                    {
                        "type": "Control",
                        "label": "Last name",
                        "scope": {
                            "$ref": "#/properties/lastName"
                        }
                    },
                    {
                        "type": "Control",
                        "label": "Birth date",
                        "scope": {
                            "$ref": "#/properties/birthDate"
                        }
                    },
                    {
                        "type": "HorizontalLayout",
                        "elements": [
                            {
                                "type": "Control",
                                "label": "Weight",
                                "scope": {
                                    "$ref": "#/properties/weight"
                                }
                            },
                            {
                                "type": "Control",
                                "label": "Height",
                                "scope": {
                                    "$ref": "#/properties/height"
                                }
                            },
                            {
                                "type": "Control",
                                "label": "Nationality",
                                "scope": {
                                    "$ref": "#/properties/nationality"
                                }
                            }
                        ]
                    },
                    {
                        "type": "Control",
                        "label": "Gender",
                        "scope": {
                            "$ref": "#/properties/gender"
                        }
                    }
                ]
            },
            {
                "type": "VerticalLayout",
                "elements": [
                    {
                        "type": "Label",
                        "text": "Site Related Data"
                    },
                    {
                        "type": "Control",
                        "label": "Registration time",
                        "scope": {
                            "$ref": "#/properties/registrationTime"
                        }
                    },
                    {
                        "type": "Control",
                        "label": "Email",
                        "scope": {
                            "$ref": "#/properties/email"
                        }
                    },
                    {
                        "type": "Control",
                        "label": "Active",
                        "scope": {
                            "$ref": "#/properties/active"
                        }
                    }
                ]
            }
        ]
    };

    vm.schema = {
        "type": "object",
        "properties": {
            "id": {
                "type": "string",
                "format": "objectId"
            },
            "lastName": {
                "type": "string"
            },
            "email": {
                "type": "string"
            },
            "firstName": {
                "type": "string"
            },
            "gender": {
                "type": "string",
                "enum": [
                    "Male",
                    "Female"
                ]
            },
            "active": {
                "type": "boolean"
            },
            "registrationTime": {
                "type": "string",
                "format": "date-time"
            },
            "weight": {
                "type": "number"
            },
            "height": {
                "type": "integer"
            },
            "nationality": {
                "type": "string",
                "enum": [
                    "German",
                    "French",
                    "UK",
                    "US",
                    "Spanish",
                    "Italian",
                    "Russian"
                ]
            },
            "birthDate": {
                "type": "string",
                "format": "date-time"
            }
        },
        "additionalProperties": false,
        "required": [
            "id",
            "lastName",
            "email"
        ]
    };

    vm.localModelDefault = JSON.stringify(vm.schema, undefined, 2);
    vm.localViewDefault = JSON.stringify(vm.uiSchema, undefined, 2);
    vm.localModel = vm.localModelDefault;
    vm.localView = vm.localViewDefault;
    vm.data = {};
});
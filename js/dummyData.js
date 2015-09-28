var app = angular.module('jsonforms-website');
app.factory('StaticData', function() {
    var provider={};
    provider.data={};
    provider.dataSchema={
        "type": "object",
        "properties": {
            "firstName": {
                "type": "string"
            },
            "lastName": {
                "type": "string"
            }
        }
    };
    provider.uiSchema={
        "type": "VerticalLayout",
        "elements": [
            {
                "type": "Control",
                "scope": {
                    "$ref": "#/properties/firstName"
                }
            },
            {
                "type": "Control",
                "scope": {
                    "$ref": "#/properties/lastName"
                }
            }
        ]
    };
    return provider;
});
app.factory('DynamicData', function() {
    var provider={};
    provider.data={};
    provider.dataSchema={
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
            "timeOfRegistration": {
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
            "dateOfBirth": {
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
    provider.uiSchema={
        "type": "VerticalLayout",
        "elements": [
            {
                "type": "HorizontalLayout",
                "elements": [
                    {
                        "type": "VerticalLayout",
                        "elements": [
                            {
                                "type": "Control",
                                "scope": {
                                    "$ref": "#/properties/firstName"
                                }
                            },
                            {
                                "type": "Control",
                                "scope": {
                                    "$ref": "#/properties/lastName"
                                }
                            },
                            {
                                "type": "Control",
                                "scope": {
                                    "$ref": "#/properties/dateOfBirth"
                                }
                            },
                            {
                                "type": "HorizontalLayout",
                                "elements": [
                                    {
                                        "type": "Control",
                                        "scope": {
                                            "$ref": "#/properties/weight"
                                        }
                                    },
                                    {
                                        "type": "Control",
                                        "scope": {
                                            "$ref": "#/properties/height"
                                        }
                                    },
                                    {
                                        "type": "Control",
                                        "scope": {
                                            "$ref": "#/properties/nationality"
                                        }
                                    }
                                ]
                            },
                            {
                                "type": "Control",
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
                                "type": "Control",
                                "scope": {
                                    "$ref": "#/properties/timeOfRegistration"
                                }
                            },
                            {
                                "type": "Control",
                                "scope": {
                                    "$ref": "#/properties/email"
                                }
                            },
                            {
                                "type": "Control",
                                "scope": {
                                    "$ref": "#/properties/active"
                                }
                            }
                        ]
                    }
                ]
            }

        ]
    };
    return provider;
});

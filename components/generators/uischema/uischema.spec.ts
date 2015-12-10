/// <reference path="../../references.ts"/>

describe('UISchemaGenerator', () => {

    var UISchemaGenerator: JSONForms.IUISchemaGenerator;

    beforeEach(module('jsonforms.generators.uischema'));
    beforeEach(() => {
        inject(['UISchemaGenerator', function(_UISchemaGenerator_: JSONForms.IUISchemaGenerator) {
            UISchemaGenerator = _UISchemaGenerator_;
        }]);
    });

    it("generate ui schema for schema w/o properties", function () {
        var schema = {
            type: "object"
        };
        var uiSchema = {
            type: "VerticalLayout",
            elements: []
        };
        expect(UISchemaGenerator.generateDefaultUISchema(schema)).toEqual(uiSchema);
    });

    it("generate ui schema for schema with one property", function () {
        var schema = {
            type: "object",
            properties: {
                name: {
                    type: "string"
                }
            }
        };
        var uiSchema = {
            type: "VerticalLayout",
            elements: [
                {
                    type: "Control",
                    label: "Name",
                    scope: {
                        $ref: "#/properties/name"
                    }
                }
            ]
        };
        expect(UISchemaGenerator.generateDefaultUISchema(schema)).toEqual(uiSchema);
    });

    it("ignore json-schema id attributes", function () {
        var schema = {
            type: "object",
            properties: {
                id: "ignore me",
                name: {
                    type: "string"
                }
            }
        };
        var uiSchema = {
            type: "VerticalLayout",
            elements: [
                {
                    type: "Control",
                    label: "Name",
                    scope: {
                        $ref: "#/properties/name"
                    }
                }
            ]
        };
        expect(UISchemaGenerator.generateDefaultUISchema(schema)).toEqual(uiSchema);
    });

    it("don't ignore non-json-schema id attributes", function () {
        var schema = {
            type: "object",
            properties: {
                id: {
                    type: "string"
                },
                name: {
                    type: "string"
                }
            }
        };
        var uiSchema = {
            type: "VerticalLayout",
            elements: [
                {
                    type: "Control",
                    label: "Id",
                    scope: {
                        $ref: "#/properties/id"
                    }
                },
                {
                    type: "Control",
                    label: "Name",
                    scope: {
                        $ref: "#/properties/name"
                    }
                }
            ]
        };
        expect(UISchemaGenerator.generateDefaultUISchema(schema)).toEqual(uiSchema);
    });

    it("generate ui schema for schema with multiple properties", function () {
        var schema = {
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
        var uiSchema = {
            "type": "VerticalLayout",
            "elements": [
                {
                    "type": "Control",
                    "label": "Id",
                    "scope": {
                        "$ref": "#/properties/id"
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
                    "label": "Email",
                    "scope": {
                        "$ref": "#/properties/email"
                    }
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
                    "label": "Gender",
                    "scope": {
                        "$ref": "#/properties/gender"
                    }
                },
                {
                    "type": "Control",
                    "label": "Active",
                    "scope": {
                        "$ref": "#/properties/active"
                    }
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
                },
                {
                    "type": "Control",
                    "label": "Birth date",
                    "scope": {
                        "$ref": "#/properties/birthDate"
                    }
                },
            ]
        };
        expect(UISchemaGenerator.generateDefaultUISchema(schema)).toEqual(uiSchema);
    });



});
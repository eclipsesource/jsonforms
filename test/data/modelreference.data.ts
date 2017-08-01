export const testDataSchema = {
  "definitions": {
    "eClassifier": {
      "anyOf":[
        {"$ref":"#/definitions/eclass"},
        {"$ref":"#/definitions/enum"},
        {"$ref":"#/definitions/datatype"}
      ]
    },
    "type": {
      "type": "object",
      "properties": {
        "id": {
          "type": "integer",
          "minimum": 0
        }
      },
      "links": [{
        "rel": "full",
        "href": "#/eClassifiers/{id}",
        "targetSchema": {
          $ref: "#/definitions/eClassifier"
        }
      }],
      "additionalProperties": false
    },
    "enum": {
      "id":"#enum",
      "type": "object",
      "properties": {
        "eClass": {
          "type": "string",
          "default": "http://www.eclipse.org/emf/2002/Ecore#//EEnum"
        },
        "_id": {
          "type": "string"
        },
        "name": {
          "type": "string"
        },
        "instanceClassName": {
          "type": "string"
        },
        "instanceTypeName": {
          "type": "string"
        },
        "serializable": {
          "type": "boolean"
        },
        "eLiterals": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
      },
      "additionalProperties": false
    },
    "datatype": {
      "id":"#datatype",
      "type": "object",
      "properties": {
        "eClass": {
          "type": "string",
          "default": "http://www.eclipse.org/emf/2002/Ecore#//EDataType"
        },
        "_id": {
          "type": "string"
        },
        "name": {
          "type": "string"
        },
        "instanceClassName": {
          "type": "string"
        },
        "instanceTypeName": {
          "type": "string"
        },
      },
      "additionalProperties": true
    },
    "eclass": {
      "type": "object",
      "id":"#class",
      "properties": {
        "eClass": {
          "type": "string",
          "default": "http://www.eclipse.org/emf/2002/Ecore#//EClass"
        },
        "_id": {
          "type": "string"
        },
        "name": {
          "type": "string"
        },
        "secondName": {
          "type": "string"
        },
        "instanceClassName": {
          "type": "string"
        },
        "instanceTypeName": {
          "type": "string"
        },
        "interface": {
          "type": "boolean"
        },
        "eStructuralFeatures": {
          "type": "array",
          "items": {
            "anyOf": [
              {"$ref": "#/definitions/attribute"},
              {"$ref": "#/definitions/reference"}
            ]
          }
        }
      },
      "additionalProperties": true
    },
    "attribute": {
      "id":"#attribute",
      "type": "object",
      "properties": {
        "eClass": {
          "type": "string",
          "default": "http://www.eclipse.org/emf/2002/Ecore#//EAttribute"
        },
        "_id": {
          "type": "string"
        },
        "name": {
          "type": "string"
        },
        "containment": {
          "type": "boolean"
        },
        "eType": {
          "type": "object",
          "properties": {
            "$ref": {
              "type": "string",
              "enum": [
                "http://www.eclipse.org/emf/2002/Ecore#//EBoolean",
                "http://www.eclipse.org/emf/2002/Ecore#//EString",
                "http://www.eclipse.org/emf/2002/Ecore#//EDate",
                "http://www.eclipse.org/emf/2002/Ecore#//EInt",
                "http://www.eclipse.org/emf/2002/Ecore#//EDouble",
              ]
            }
          }
        }
      },
      "additionalProperties": true
    },
    "reference": {
      "id": "#reference",
      "type": "object",
      "properties": {
        "eClass": {
          "type": "string",
          "default": "http://www.eclipse.org/emf/2002/Ecore#//EReference"
        },
        "_id": {
          "type": "string"
        },
        "name": {
          "type": "string"
        },
        "lowerBound": {
          "type": "integer"
        },
        "upperBound": {
          "type": "integer"
        },
        "many": {
          "type": "boolean"
        },
        "containment": {
          "type": "boolean"
        },
        "eOpposite": {
          "type": "object",
          "properties": {
            "$ref": {
              "type": "string"
            }
          },
          "additionalProperties": false
        },
        "eType": {
          "type": "string",
        }
      },
      "links": [{
        "rel": "full",
        "href": "#/eClassifiers/{eType}",
        "targetSchema": {
          $ref: "#/definitions/eclass"
        }
      }],
      "additionalProperties": true
    }
  },
  "type": "object",
  "id":"#package",
  "properties": {
    "eClass": {
      "type": "string",
      "default": "http://www.eclipse.org/emf/2002/Ecore#//EPackage"
    },
    "_id": {
      "type": "string"
    },
    "name": {
      "type": "string"
    },
    "nsURI": {
      "type": "string"
    },
    "nsPrefix": {
      "type": "string"
    },
    "eClassifiers": {
      "type": "array",
      "items": {
        "anyOf": [
            {"$ref": "#/definitions/eclass"},
            {"$ref": "#/definitions/enum"},
            {"$ref": "#/definitions/datatype"}
        ]
      }
    }
  },
  "additionalProperties": false
}

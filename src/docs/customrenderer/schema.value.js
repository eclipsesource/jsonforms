angular.module('jsonforms-website')
    .value('CustomRendererSchema', {
        "type": "object",
        "properties": {
            "name": {
                "type": "string",
                "minLength": 3
            },
            "description": {
                "type": "string"
            },
            "rating": {
                "type": "integer",
                "maximum": 5
            },
            "done": {
                "type": "boolean"
            }
        },
        "required": ["name"]
    });
angular.module('jsonforms-website')
    .value('CustomRendererUiSchema', {
        "type": "VerticalLayout",
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
                "label": "Description",
                "scope": {
                    "$ref": "#/properties/description"
                },
                "options": {
                    "multi": true
                }
            },
            {
                "type": "Control",
                "label": "Rating",
                "scope": {
                    "$ref": "#/properties/rating"
                }
            },
            {
                "type": "Control",
                "label": "Done?",
                "scope": {
                    "$ref": "#/properties/done"
                }
            }
        ]
    });
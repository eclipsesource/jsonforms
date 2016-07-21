export default {
    "type": "HorizontalLayout",
    "elements": [
        {
            "type": "Control",
            "options": {
                "primaryItems": ["name", "age"]
            },
            "scope": { "$ref": "#/properties/people" }
        }
    ]
}

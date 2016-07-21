export default {
    "type": "object",
    "properties": {
        "people": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "name": {
                        "type": "string"
                    },
                    "age": {
                        "type": "integer"
                    },
                    "gender": {
                        "type": "string",
                        "enum": ["Male", "Female"]
                    }
                }
            },
        }
    }
}


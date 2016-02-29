/// <reference path="../../references.ts"/>

describe("PathResolver", () => {

    it("", () => {
        let schema = {
            "properties": {
                "comments": {
                    "type": "array",
                    "items": {
                        "properties": {
                            "msg": {"type": "string"}
                        }
                    }
                }
            }
        };
        let schemaPath = "#/properties/comments";
        let data = {};
        let pathResolver = new JSONForms.PathResolver();
        let resolvedData = pathResolver.resolveInstance(data, schemaPath);
        expect(resolvedData).toBeUndefined();
    });

});

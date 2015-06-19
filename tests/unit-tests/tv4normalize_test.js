describe("$ref 01", function () {
    it("normalise - id relative to parent", function () {
        var schema = {
            "id": "http://example.com/schema",
            "items": {
                "id": "otherSchema",
                "items": {
                    "$ref": "#"
                }
            }
        };
        tv4.normSchema(schema);

        expect(schema.items.items).toEqual({"$ref": "http://example.com/otherSchema#"});
    });
});

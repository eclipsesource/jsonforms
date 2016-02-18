/// <reference path="../references.ts"/>

describe('PathUtil', () => {

    it("should add index to path if schema property type is array",() => {
        var schemaPath = "#/properties/comments/items/0/properties/message";

        expect(JSONForms.PathUtil.normalize(schemaPath)).toBe("comments/0/message");


    });
});
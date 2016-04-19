import "angular"
import "angular-mocks"

import {PathResolver} from "./jsonforms-pathresolver";

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
        let pathResolver = new PathResolver();
        let resolvedData = pathResolver.resolveInstance(data, schemaPath);
        expect(resolvedData).toBeUndefined();
    });

});

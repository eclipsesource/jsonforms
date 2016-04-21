import "angular"
import "angular-mocks"

import {PathUtil} from "./pathutil";

describe("Path-Util", () => {

   it("should throw error if passed undefined or null in toPropertyAccessString", () => {
      expect(() => PathUtil.toPropertyAccessString(undefined)).toThrowError();
      expect(() => PathUtil.toPropertyAccessString(null)).toThrowError();
   });
   
   it("should return a proper property access path for paths of length 2 in toPropertyAccessString", () => {
      expect(PathUtil.toPropertyAccessString("/property1/property1a")).toBe("['property1']['property1a']");
   });
   
    it("should add index to path if schema property type is array",() => {
        var schemaPath = "#/properties/comments/items/0/properties/message";
        expect(PathUtil.normalize(schemaPath)).toBe("comments/0/message");
    });
});

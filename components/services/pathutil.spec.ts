/// <reference path="../references.ts"/>
describe("Path-Util", () => {
   it("should throw error if passed undefined or null in toPropertyAccessString", () => {
      expect(() => JSONForms.PathUtil.toPropertyAccessString(undefined)).toThrowError();
      expect(() => JSONForms.PathUtil.toPropertyAccessString(null)).toThrowError();
   });
   it("should return a proper property access path for paths of length 2 in toPropertyAccessString", () => {
      expect(JSONForms.PathUtil.toPropertyAccessString("/property1/property1a")).toBe("['property1']['property1a']");
   });
});
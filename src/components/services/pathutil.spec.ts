import 'angular';
import 'angular-mocks';

import {PathUtil} from './pathutil';

describe('PathUtil', () => {

   it('should throw error if passed undefined or null in toPropertyAccessString', () => {
      expect(() => PathUtil.toPropertyAccessString(undefined)).toThrowError();
      expect(() => PathUtil.toPropertyAccessString(null)).toThrowError();
   });

    it('should return an empty array when converting a path to fragments', () => {
        expect(PathUtil.toPropertyFragments(undefined)).toEqual([]);
    });

    it('should convert a string to start case when beautifying it', () => {
        expect(PathUtil.beautify('first name')).toBe('First Name');
    });

    it('should return the last fragment', () => {
        expect(PathUtil.lastFragment('foo/bar')).toBe('bar');
    });

    it('should beautify the last fragment', () => {
        expect(PathUtil.beautifiedLastFragment('foo/bar')).toBe('Bar');
    });

    it('should filter indices from a path', () => {
        expect(PathUtil.filterIndexes('foo/items/1/bar')).toBe('foo/items/bar');
    });

   it('should return a proper property access path for paths of length 2 in toPropertyAccessString',
    () => {
      expect(PathUtil.toPropertyAccessString('/property1/property1a'))
        .toBe('[\'property1\'][\'property1a\']');
   });

    it('should add index to path if schema property type is array', () => {
        let schemaPath = '#/properties/comments/items/0/properties/message';
        expect(PathUtil.normalize(schemaPath)).toBe('comments/0/message');
    });
});

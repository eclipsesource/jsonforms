import 'angular';
import 'angular-mocks';
import {PathResolver} from "./path-resolver";

describe('PathResolver', () => {

    it('', () => {
        let schemaPath = '#/properties/comments';
        let data = {};
        let resolvedData = PathResolver.resolveInstance(data, schemaPath);
        expect(resolvedData).toBeUndefined();
    });

});

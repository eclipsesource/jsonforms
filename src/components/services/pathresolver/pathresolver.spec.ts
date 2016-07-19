import 'angular';
import 'angular-mocks';
import {PathResolver} from "./jsonforms-pathresolver";

describe('PathResolver', () => {

    it('', () => {
        let schemaPath = '#/properties/comments';
        let data = {};
        let resolvedData = PathResolver.resolveInstance(data, schemaPath);
        expect(resolvedData).toBeUndefined();
    });

});

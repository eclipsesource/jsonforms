import 'angular';
import 'angular-mocks';

import {PathResolver} from './jsonforms-pathresolver';

describe('PathResolver', () => {

    it('', () => {
        let schemaPath = '#/properties/comments';
        let data = {};
        let pathResolver = new PathResolver();
        let resolvedData = pathResolver.resolveInstance(data, schemaPath);
        expect(resolvedData).toBeUndefined();
    });

});

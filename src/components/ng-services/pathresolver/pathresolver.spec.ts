import 'angular';
import 'angular-mocks';

import {IPathResolver} from '../../services/pathresolver/jsonforms-pathresolver';

describe('PathResolver', () => {

    let PathResolver: IPathResolver;

    beforeEach(angular.mock.module('jsonforms.pathresolver'));
    beforeEach(() => {
        inject(['PathResolver', function(_PathResolver_: IPathResolver) {
            PathResolver = _PathResolver_;
        }]);
    });


    it('should resolve properties path on the UI schema', function () {

        let obj = {
            'foo': {
                'bar': {
                    'scope': {
                        '$ref': { 'type': 'string' }
                    }
                }
            }
        };

        expect(PathResolver.resolveUi(obj, '#/foo/bar').type).toBe('string');
    });

});

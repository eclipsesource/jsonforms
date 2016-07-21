import 'angular';
import 'angular-mocks';
import {PathResolver} from "../../services/pathresolver/jsonforms-pathresolver";

describe('PathResolver', () => {
    
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

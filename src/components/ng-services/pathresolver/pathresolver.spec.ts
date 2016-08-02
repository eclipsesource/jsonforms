import 'angular';
import 'angular-mocks';
import '../../../index'
import {PointerResolver} from "../../services/pathresolver/jsonforms-pathresolver";

describe('PathResolver', () => {

    beforeEach(angular.mock.module('jsonforms.services'));

    it('should resolve properties path on the UI schema',
        angular.mock.inject(['PathResolver', (pointerResolver: PointerResolver) => {

        let obj = {
            'foo': {
                'bar': {
                    'scope': {
                        '$ref': { 'type': 'string' }
                    }
                }
            }
        };

        expect(pointerResolver.resolveUi(obj, '#/foo/bar').type).toBe('string');
    }]));
});

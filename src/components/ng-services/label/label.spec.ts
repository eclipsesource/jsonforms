import 'angular';
import 'angular-mocks';
import '../../../index';
import {IWithLabel} from "../../../uischema";
import {Labels} from "../../renderers/Labels";

describe('Label Service', () => {

    let labelService: Labels;

    beforeEach(angular.mock.module('jsonforms.services'));
    beforeEach(() => {
        inject(['LabelService', function(_LabelService_) {
            labelService = _LabelService_;
        }]);
    });


    it('should resolve properties path on the UI schema', function () {
        let labelObj: IWithLabel = {
            "label": {
                "text": "random",
                "show": false
            }
        };
        expect(labelService.shouldShowLabel(labelObj)).toBeFalsy();
    });

});

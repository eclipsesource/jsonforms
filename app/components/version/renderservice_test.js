///**
// * Created by Edgar on 28.02.2015.
// */
//
'use strict';

describe('Testing the jsonForms.renderService', function() {

    beforeEach(module('jsonForms.renderService'));

    it('blub', inject(function(RenderService) {
        expect(RenderService).not.toBeUndefined();
        RenderService.register({
            id: "myWidget",
            render: function (element, model, instance) {

            }
        });
        expect(RenderService.hasRendererFor({
            type: "myWidget"
        })).toBe(true);
    }))
});

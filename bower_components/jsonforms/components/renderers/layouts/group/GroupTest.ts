/// <reference path="../../../references.ts"/>

describe('Group', () => {

    // load all necessary modules and templates
    beforeEach(module('jsonforms.form'));
    beforeEach(module('jsonforms.renderers.layouts.group'));
    beforeEach(module('jsonforms.renderers.controls.string'));

    beforeEach(module('components/form/form.html'));
    beforeEach(module('components/renderers/layouts/layout.html'));
    beforeEach(module('components/renderers/controls/control.html'));

    it("should support labels 2", inject(($rootScope, $compile) => {
        var scope = $rootScope.$new();
        scope.schema = {
            "properties": {
                "foo": { "type": "string" }
            }
        };
        scope.uiSchema = {
            "type": "Group",
            "label": "woot",
            "elements": [
                {
                    "type": "Control",
                    "scope": {
                        "$ref": "#/properties/foo"
                    }
                }
            ]
        };
        scope.data = { "name": "John Doe "};
        var el = $compile('<jsonforms schema="schema" ui-schema="uiSchema" data="data"/>')(scope);
        scope.$digest();
        var div = el.find('div');
        expect(div.hasClass('jsf-group')).toBeTruthy();
    }));
});



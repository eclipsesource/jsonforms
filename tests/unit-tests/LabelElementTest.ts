/// <reference path="../references.ts"/>

describe('LabelElement', () => {

    // load all necessary modules and templates
    beforeEach(module('jsonforms.form'));
    beforeEach(module('jsonforms.renderers.extras.label'));
    beforeEach(module('components/form/form.html'));

    it("should be rendered", inject(function($rootScope, $compile) {
        var scope = $rootScope.$new();
        scope.schema = {
            "properties": {}
        };
        scope.uiSchema = { "type": "Label", "text": "My Label" };
        scope.data = { "name": "John Doe "};
        var el = $compile('<jsonforms schema="schema" ui-schema="uiSchema" data="data"/>')(scope);
        scope.$digest();
        expect(el.html()).toContain("My Label");
    }));
});

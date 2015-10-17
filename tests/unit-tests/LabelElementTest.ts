/// <reference path="../../typings/jasmine/jasmine.d.ts"/>
/// <reference path="../../typings/angularjs/angular.d.ts"/>
/// <reference path="../../typings/angularjs/angular-mocks.d.ts"/>
/// <reference path="../../js/services.ts"/>
/// <reference path="../../typings/schemas/uischema.d.ts"/>

describe('LabelElement', () => {

    // load all necessary modules and templates
    beforeEach(module('jsonforms.services'));
    beforeEach(module('jsonforms.directives'));
    beforeEach(module('jsonforms.label'));
    beforeEach(module('templates/form.html'));
    beforeEach(module('templates/element.html'));

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

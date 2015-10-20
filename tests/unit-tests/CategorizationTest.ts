/// <reference path="../../typings/jasmine/jasmine.d.ts"/>
/// <reference path="../../typings/angularjs/angular.d.ts"/>
/// <reference path="../../typings/angularjs/angular-mocks.d.ts"/>
/// <reference path="../../components/services.ts"/>
/// <reference path="../../typings/schemas/uischema.d.ts"/>

describe('Categorization', () => {

    // load all necessary modules and templates
    beforeEach(module('jsonforms.services'));
    beforeEach(module('jsonforms.directives'));
    beforeEach(module('jsonforms.categorization'));
    beforeEach(module('jsonforms.stringControl'));
    beforeEach(module('templates/form.html'));
    beforeEach(module('templates/control.html'));
    beforeEach(module('templates/layout.html'));

    it("should be rendered", inject(function($rootScope, $compile) {
        var scope = $rootScope.$new();
        scope.schema = {
            "properties": {
                "name": {
                    "type": "string"
                }
            }
        };
        scope.uiSchema = {
            "type": "Categorization",
            "elements": [
                {
                    "type": "Category",
                    "label":"Tab1",
                    "elements": [
                        {
                            "type": "Control",
                            "label": "Name",
                            "scope": {
                                "$ref": "#/properties/name"
                            }
                        },
                    ]
                },
                {
                    "type": "Category",
                    "label":"MyTab2",
                    "elements": [
                        {
                            "type": "Control",
                            "label": "Name",
                            "scope": {
                                "$ref": "#/properties/name"
                            }
                        },
                    ]
                },
            ]
        };
        scope.data = { "name": "John Doe "};
        var el = $compile('<jsonforms schema="schema" ui-schema="uiSchema" data="data"/>')(scope);
        scope.$digest();
        expect(el.html()).toContain("</tabset>"); //this is not resolved completly
        expect(el.html()).toContain("</tab>"); //this is not resolved completly
        expect(el.html()).toContain('heading="Tab1"');
        expect(el.html()).toContain('heading="MyTab2"');
    }));
});

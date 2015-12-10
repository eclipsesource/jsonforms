/// <reference path="../../../../references.ts"/>

describe('Categorization', () => {

    // load all necessary modules and templates
    beforeEach(module('jsonforms.form'));
    beforeEach(module('jsonforms.renderers.layouts.categories.categorization'));
    beforeEach(module('jsonforms.renderers.layouts.categories.category'));
    beforeEach(module('jsonforms.renderers.controls.string'));

    beforeEach(module('components/form/form.html'));
    beforeEach(module('components/renderers/layouts/layout.html'));
    beforeEach(module('components/renderers/controls/control.html'));

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

/// <reference path="../../../references.ts"/>

describe('Array renderer', () => {

    // load all necessary modules and templates
    beforeEach(module('jsonforms.form'));
    beforeEach(module('jsonforms.renderers.controls.string'));
    beforeEach(module('jsonforms.renderers.controls.array'));

    beforeEach(module('components/form/form.html'));
    beforeEach(module('components/renderers/layouts/layout.html'));
    beforeEach(module('components/renderers/controls/control.html'));

    it("should render a table based on ui-grid", inject(($rootScope, $compile) => {
        var scope = $rootScope.$new();
        scope.schema = {
            "type": "object",
            "properties": {
                "animals": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "name": { "type": "string"  },
                            "legs": { "type": "integer" }
                        }
                    }
                }
            }
        };

        // TODO: missing test: no columns definition given
        scope.uiSchema = {
            "type": "Control",
            "scope": { "$ref": "#/properties/animals" },
            "columns": [
                {
                    "scope": {
                        "$ref": "#/items/properties/name"
                    }
                },
                {
                    "scope": {
                        "$ref": "#/items/properties/legs"
                    }
                }
            ]
        };

        scope.data = [

        ];
        var el = $compile('<jsonforms schema="schema" ui-schema="uiSchema" data="data"/>')(scope);
        scope.$digest();
        expect(el.html()).toContain("ui-grid");
    }));

});
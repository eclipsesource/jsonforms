/// <reference path="../../../references.ts"/>

describe('MasterDetail', () => {

    // load all necessary modules and templates
    beforeEach(module('jsonforms.form'));
    beforeEach(module('jsonforms.renderers.layouts.masterdetail'));
    beforeEach(module('jsonforms.renderers.controls.string'));

    beforeEach(module('components/form/form.html'));
    beforeEach(module('components/renderers/layouts/layout.html'));
    beforeEach(module('components/renderers/controls/control.html'));

    it("should be rendered", inject(($rootScope, $compile) => {
        var scope = $rootScope.$new();
        scope.schema = {
            "type": "object",
            "properties": {
                "a":{
                    "type": "array",
                    "items": {
                        "type":"object",
                        "properties":{
                            "name": {
                                "type": "string"
                            },
                        }
                    },
                },
                "c":{
                    "type": "array",
                    "items": {
                        "type":"object",
                        "properties":{
                            "name": {
                                "type": "string"
                            },
                        }
                    }
                },
            }
        };
        scope.uiSchema = {
            "type":"MasterDetailLayout",
            "scope": {
                "$ref": "#"
            },
        };
        scope.data = {
            "a":
                [
                    {"name":"x_1"},
                    {"name":"x_2"}
                ],
            "c":[
                    {"name":"y_1"},
                    {"name":"y_2"}
                ]
            };
        var el = $compile('<jsonforms schema="schema" ui-schema="uiSchema" data="data"/>')(scope);
        scope.$digest();
        expect(el.html()).toContain("<!-- Master -->"); //this is not resolved completly
        expect(el.html()).toContain("<!-- Detail -->"); //this is not resolved completly
        expect(el.html()).toContain('a');
        expect(el.html()).toContain('x_1');
        expect(el.html()).toContain('x_2');
        expect(el.html()).toContain('c');
        expect(el.html()).toContain('y_1');
        expect(el.html()).toContain('y_2');

        var nameInput_empty = el[0].querySelector("#\\#\\/properties\\/name");
        expect(nameInput_empty).toBeNull();

        var x1 = el[0].querySelector("accordion accordion accordion-heading span");
        angular.element(x1).triggerHandler("click");
        expect(el.html()).toContain("<label");
        var nameInput = el[0].querySelector("#\\#\\/properties\\/name");
        expect(nameInput).not.toBeNull();
    }));
});

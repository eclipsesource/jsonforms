/// <reference path="../../../references.ts"/>

describe('Array renderer', () => {

    // load all necessary modules and templates
    beforeEach(module('jsonforms.form'));
    beforeEach(module('jsonforms.renderers.controls.array'));

    beforeEach(module('components/form/form.html'));
    beforeEach(module('components/renderers/controls/control.html'));
    beforeEach(module('components/renderers/layouts/layout.html'));

    it("should render elements", inject(($rootScope, $compile) => {
        let scope = $rootScope.$new();
        scope.schema = {
            "properties": {
                "comments": {
                    "type": "array",
                    "items": {
                        "properties": {
                            "msg": {"type": "string"}
                        }
                    }
                }
            }
        };
        scope.uiSchema = { "type": "Control", "scope": { "$ref": "#/properties/comments" } };
        scope.data = {"comments": [{"msg": "Some message"}, {"msg": "Another message"}]};
        let el = $compile('<jsonforms schema="schema" ui-schema="uiSchema" data="data"/>')(scope);
        scope.$digest();
        expect(angular.element(el[0].getElementsByClassName('jsf-group').length)[0]).toBe(3);
    }));

    it("should render an empty array", inject(($rootScope, $compile) => {
        let scope = $rootScope.$new();
        scope.schema = {
            "properties": {
                "comments": {
                    "type": "array",
                    "items": {
                        "properties": {
                            "msg": {"type": "string"}
                        }
                    }
                }
            }
        };
        scope.uiSchema = {
            "type": "Control",
            "scope": { "$ref": "#/properties/comments" },
            "options": {
                "submit": true
            }
        };
        scope.data = {};
        let el = $compile('<jsonforms schema="schema" ui-schema="uiSchema" data="data"/>')(scope);
        scope.$digest();
        expect(angular.element(el[0].getElementsByClassName('jsf-group').length)[0]).toBe(1);
    }));

    it("should be capable of rendering an array as read-only", inject(($rootScope, $compile) => {
        let scope = $rootScope.$new();
        scope.schema = {
            "properties": {
                "comments": {
                    "type": "array",
                    "items": {
                        "properties": {
                            "msg": {"type": "string"}
                        }
                    }
                }
            }
        };
        scope.uiSchema = {
            "type": "Control",
            "scope": { "$ref": "#/properties/comments" },
            "readOnly": true,
            "options": {
                "submit": true
            }
        };
        scope.data = {};
        let el = $compile('<jsonforms schema="schema" ui-schema="uiSchema" data="data"/>')(scope);
        scope.$digest();
        let fieldSet = angular.element(el[0].getElementsByTagName("fieldset"));
        console.log(fieldSet);
        expect(fieldSet.attr("disabled")).toBeDefined();
    }));
});
/// <reference path="../references.ts"/>

describe('Generic renderer', () => {

    // load all necessary modules and templates
    beforeEach(module('jsonforms.form'));
    beforeEach(module('jsonforms.renderers.controls.string'));

    beforeEach(module('components/form/form.html'));
    beforeEach(module('components/renderers/controls/control.html'));

    it("should render the provided label string", inject(($rootScope, $compile) => {
        let scope = $rootScope.$new();
        scope.schema = {
            "properties": {
                "name": {
                    "type": "string"
                }
            }
        };
        scope.uiSchema = {
            "type": "Control",
            "label": "LabeL",
            "scope": {
                "$ref": "#/properties/name"
            }
        };
        scope.data = { "name": "My Name" };
        let el = $compile('<jsonforms schema="schema" ui-schema="uiSchema" data="data"/>')(scope);
        scope.$digest();
        expect(el.find("label").text()).toEqual("LabeL");
    }));

    it("should render the default label if no label is provided", inject(($rootScope, $compile) => {
        let scope = $rootScope.$new();
        scope.schema = {
            "properties": {
                "name": {
                    "type": "string"
                }
            }
        };
        scope.uiSchema = {
            "type": "Control",
            "scope": {
                "$ref": "#/properties/name"
            }
        };
        scope.data = { "name": "My Name" };
        let el = $compile('<jsonforms schema="schema" ui-schema="uiSchema" data="data"/>')(scope);
        scope.$digest();
        expect(el.find("label").text()).toEqual("Name");
    }));

    it("should render the default label if label is set to true", inject(($rootScope, $compile) => {
        let scope = $rootScope.$new();
        scope.schema = {
            "properties": {
                "name": {
                    "type": "string"
                }
            }
        };
        scope.uiSchema = {
            "type": "Control",
            "label": true,
            "scope": {
                "$ref": "#/properties/name"
            }
        };
        scope.data = { "name": "My Name" };
        let el = $compile('<jsonforms schema="schema" ui-schema="uiSchema" data="data"/>')(scope);
        scope.$digest();
        expect(el.find("label").text()).toEqual("Name");
    }));

    it("should hide the label when label is set to false", inject(($rootScope, $compile) => {
        let scope = $rootScope.$new();
        scope.schema = {
            "properties": {
                "name": {
                    "type": "string"
                }
            }
        };
        scope.uiSchema = {
            "type": "Control",
            "label": false,
            "scope": {
                "$ref": "#/properties/name"
            }
        };
        scope.data = { "name": "My Name" };
        let el = $compile('<jsonforms schema="schema" ui-schema="uiSchema" data="data"/>')(scope);
        scope.$digest();
        expect(el.find("label").text()).toBeFalsy();
    }));

    it("should render the default label if an empty object is given", inject(($rootScope, $compile) => {
        let scope = $rootScope.$new();
        scope.schema = {
            "properties": {
                "name": {
                    "type": "string"
                }
            }
        };
        scope.uiSchema = {
            "type": "Control",
            "label": {},
            "scope": {
                "$ref": "#/properties/name"
            }
        };
        scope.data = { "name": "My Name" };
        let el = $compile('<jsonforms schema="schema" ui-schema="uiSchema" data="data"/>')(scope);
        scope.$digest();
        expect(el.find("label").text()).toEqual("Name");
    }));

    it("should render the provided label object with the given text attribute", inject(($rootScope, $compile) => {
        let scope = $rootScope.$new();
        scope.schema = {
            "properties": {
                "name": {
                    "type": "string"
                }
            }
        };
        scope.uiSchema = {
            "type": "Control",
            "label": {
                "text": "LabeL"
            },
            "scope": {
                "$ref": "#/properties/name"
            }
        };
        scope.data = { "name": "My Name" };
        let el = $compile('<jsonforms schema="schema" ui-schema="uiSchema" data="data"/>')(scope);
        scope.$digest();
        expect(el.find("label").text()).toEqual("LabeL");
    }));

    it("should render the provided label object with text attribute and show attribute set to true", inject(($rootScope, $compile) => {
        let scope = $rootScope.$new();
        scope.schema = {
            "properties": {
                "name": {
                    "type": "string"
                }
            }
        };
        scope.uiSchema = {
            "type": "Control",
            "label": {
                "text": "LabeL",
                "show": true
            },
            "scope": {
                "$ref": "#/properties/name"
            }
        };
        scope.data = { "name": "My Name" };
        let el = $compile('<jsonforms schema="schema" ui-schema="uiSchema" data="data"/>')(scope);
        scope.$digest();
        expect(el.find("label").text()).toEqual("LabeL");
    }));

    it("should hide the label when show attribute is set to false", inject(($rootScope, $compile) => {
        let scope = $rootScope.$new();
        scope.schema = {
            "properties": {
                "name": {
                    "type": "string"
                }
            }
        };
        scope.uiSchema = {
            "type": "Control",
            "label": {
                "show": false
            },
            "scope": {
                "$ref": "#/properties/name"
            }
        };
        scope.data = { "name": "My Name" };
        let el = $compile('<jsonforms schema="schema" ui-schema="uiSchema" data="data"/>')(scope);
        scope.$digest();
        expect(el.find("label").text()).toBeFalsy();
    }));

    it("should render the default label when show attribute is set to true", inject(($rootScope, $compile) => {
        let scope = $rootScope.$new();
        scope.schema = {
            "properties": {
                "name": {
                    "type": "string"
                }
            }
        };
        scope.uiSchema = {
            "type": "Control",
            "label": {
                "show": true
            },
            "scope": {
                "$ref": "#/properties/name"
            }
        };
        scope.data = { "name": "My Name" };
        let el = $compile('<jsonforms schema="schema" ui-schema="uiSchema" data="data"/>')(scope);
        scope.$digest();
        expect(el.find("label").text()).toEqual("Name");
    }));

    it("should hide the label when text is defined but show is set to false", inject(($rootScope, $compile) => {
        let scope = $rootScope.$new();
        scope.schema = {
            "properties": {
                "name": {
                    "type": "string"
                }
            }
        };
        scope.uiSchema = {
            "type": "Control",
            "label": {
                "text": "LabeL",
                "show": false
            },
            "scope": {
                "$ref": "#/properties/name"
            }
        };
        scope.data = { "name": "My Name" };
        let el = $compile('<jsonforms schema="schema" ui-schema="uiSchema" data="data"/>')(scope);
        scope.$digest();
        expect(el.find("label").text()).toBeFalsy();
    }));
});
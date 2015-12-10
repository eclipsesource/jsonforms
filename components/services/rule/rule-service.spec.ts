/// <reference path="../../references.ts"/>

describe('RuleServiceTest', () => {

    // load all necessary modules and templates
    beforeEach(module('jsonforms.form'));
    beforeEach(module('components/form/form.html'));
    beforeEach(module('components/renderers/layouts/layout.html'));
    beforeEach(module('components/renderers/controls/control.html'));

    it("rule evaluated on VerticalLayout", inject(function($rootScope, $compile) {
        var scope = $rootScope.$new();
        scope.schema = {
            "properties": {
                "name": {
                    "type": "string"
                },
                "age": {
                    "type": "number"
                }
            }
        };
        scope.uiSchema = {
            "type": "VerticalLayout",
            "elements": [],
            "rule": {
                "effect": "HIDE",
                "condition": {
                    "type": "LEAF",
                    "scope": {
                        "$ref": "#/properties/age"
                    },
                    "expectedValue": 36
                }
            }
        };
        scope.data = { "name": "John Doe", "age": 36 };
        var el = $compile('<jsonforms schema="schema" ui-schema="uiSchema" data="data"/>')(scope);
        scope.$digest();
        expect(angular.element(el[0].querySelector("form  div")).hasClass('ng-hide')).toBe(true);
    }));

    it("rule Hide evaluated on startup", inject(function($rootScope, $compile) {
        var scope = $rootScope.$new();
        scope.schema = {
            "properties": {
                "name": {
                    "type": "string"
                },
                "age": {
                    "type": "number"
                }
            }
        };
        scope.uiSchema = {
            "type": "VerticalLayout",
            "elements": [
                {
                    "type": "Control",
                    "scope": { "$ref": "#/properties/name" },
                    "rule": {
                        "effect": "HIDE",
                        "condition": {
                            "type": "LEAF",
                            "scope": {
                                "$ref": "#/properties/age"
                            },
                            "expectedValue": 36
                        }
                    }
                },
                {
                    "type": "Control",
                    "scope": { "$ref": "#/properties/age" },
                }
            ]
        };
        scope.data = { "name": "John Doe", "age": 36 };
        var el = $compile('<jsonforms schema="schema" ui-schema="uiSchema" data="data"/>')(scope);
        scope.$digest();
        expect(angular.element(el[0].querySelector("#\\#\\/properties\\/name").parentNode.parentNode).hasClass('ng-hide')).toBe(true);
    }));

    it("rule Hide evaluated on startup single control", inject(function($rootScope, $compile) {
        var scope = $rootScope.$new();
        scope.schema = {
            "properties": {
                "name": {
                    "type": "string"
                },
                "age": {
                    "type": "number"
                }
            }
        };
        scope.uiSchema = {
            "type": "Control",
            "scope": { "$ref": "#/properties/name" },
            "rule": {
                "effect": "HIDE",
                "condition": {
                    "type": "LEAF",
                    "scope": {
                        "$ref": "#/properties/age"
                    },
                    "expectedValue": 36
                }
            }
        };
        scope.data = { "name": "John Doe", "age": 36 };
        var el = $compile('<jsonforms schema="schema" ui-schema="uiSchema" data="data"/>')(scope);
        scope.$digest();
        expect(angular.element(el[0].querySelector("#\\#\\/properties\\/name").parentNode.parentNode).hasClass('ng-hide')).toBe(true);
    }));

    it("rule Show evaluated on startup", inject(function($rootScope, $compile) {
        var scope = $rootScope.$new();
        scope.schema = {
            "properties": {
                "name": {
                    "type": "string"
                },
                "age": {
                    "type": "number"
                }
            }
        };
        scope.uiSchema = {
            "type": "VerticalLayout",
            "elements": [
                {
                    "type": "Control",
                    "scope": { "$ref": "#/properties/name" },
                    "rule": {
                        "effect": "SHOW",
                        "condition": {
                            "type": "LEAF",
                            "scope": {
                                "$ref": "#/properties/age"
                            },
                            "expectedValue": 36
                        }
                    }
                },
                {
                    "type": "Control",
                    "scope": { "$ref": "#/properties/age" },
                }
            ]
        };
        scope.data = { "name": "John Doe", "age": 37 };
        var el = $compile('<jsonforms schema="schema" ui-schema="uiSchema" data="data"/>')(scope);
        scope.$digest();
        expect(angular.element(el[0].querySelector("#\\#\\/properties\\/name").parentNode.parentNode).hasClass('ng-hide')).toBe(true);
    }));

    it("rule Show evaluated on startup single control", inject(function($rootScope, $compile) {
        var scope = $rootScope.$new();
        scope.schema = {
            "properties": {
                "name": {
                    "type": "string"
                },
                "age": {
                    "type": "number"
                }
            }
        };
        scope.uiSchema = {
            "type": "Control",
            "scope": { "$ref": "#/properties/name" },
            "rule": {
                "effect": "SHOW",
                "condition": {
                    "type": "LEAF",
                    "scope": {
                        "$ref": "#/properties/age"
                    },
                    "expectedValue": 36
                }
            }
        };
        scope.data = { "name": "John Doe", "age": 37 };
        var el = $compile('<jsonforms schema="schema" ui-schema="uiSchema" data="data"/>')(scope);
        scope.$digest();
        expect(angular.element(el[0].querySelector("#\\#\\/properties\\/name").parentNode.parentNode).hasClass('ng-hide')).toBe(true);
    }));

    it("rule Hide dynamic", inject(function($rootScope, $compile) {
        var scope = $rootScope.$new();
        scope.schema = {
            "properties": {
                "name": {
                    "type": "string"
                },
                "age": {
                    "type": "number"
                }
            }
        };
        scope.uiSchema = {
            "type": "VerticalLayout",
            "elements": [
                {
                    "type": "Control",
                    "scope": { "$ref": "#/properties/name" },
                    "rule": {
                        "effect": "HIDE",
                        "condition": {
                            "type": "LEAF",
                            "scope": {
                                "$ref": "#/properties/age"
                            },
                            "expectedValue": 36
                        }
                    }
                },
                {
                    "type": "Control",
                    "scope": { "$ref": "#/properties/age" },
                }
            ]
        };
        scope.data = { "name": "John Doe", "age": 36 };
        var el = $compile('<jsonforms schema="schema" ui-schema="uiSchema" data="data"/>')(scope);
        scope.$digest();
        var name = el[0].querySelector("#\\#\\/properties\\/name");
        var age = el[0].querySelector("#\\#\\/properties\\/age");
        expect(angular.element(name.parentNode.parentNode).hasClass('ng-hide')).toBe(true);
        angular.element(age).val("37").triggerHandler("change");
        expect(angular.element(name.parentNode.parentNode).hasClass('ng-hide')).toBe(false);
    }));

    it("rule Show dynamic", inject(function($rootScope, $compile) {
        var scope = $rootScope.$new();
        scope.schema = {
            "properties": {
                "name": {
                    "type": "string"
                },
                "age": {
                    "type": "number"
                }
            }
        };
        scope.uiSchema = {
            "type": "VerticalLayout",
            "elements": [
                {
                    "type": "Control",
                    "scope": { "$ref": "#/properties/name" },
                    "rule": {
                        "effect": "SHOW",
                        "condition": {
                            "type": "LEAF",
                            "scope": {
                                "$ref": "#/properties/age"
                            },
                            "expectedValue": 36
                        }
                    }
                },
                {
                    "type": "Control",
                    "scope": { "$ref": "#/properties/age" },
                }
            ]
        };
        scope.data = { "name": "John Doe", "age": 37 };
        var el = $compile('<jsonforms schema="schema" ui-schema="uiSchema" data="data"/>')(scope);
        scope.$digest();
        var name = el[0].querySelector("#\\#\\/properties\\/name");
        var age = el[0].querySelector("#\\#\\/properties\\/age");
        expect(angular.element(name.parentNode.parentNode).hasClass('ng-hide')).toBe(true);
        angular.element(age).val("36").triggerHandler("change");
        expect(angular.element(name.parentNode.parentNode).hasClass('ng-hide')).toBe(false);
    }));
});

(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*! jsonforms - v0.0.1 - 2015-07-02 Copyright (c) EclipseSource Muenchen GmbH and others. */ 
'use strict';
// Source: js/app.js

angular.module('jsonForms', [
    'ui.bootstrap',
    'ui.validate',
    'ui.grid',
    'ui.grid.pagination',
    'ui.grid.autoResize',
    'jsonForms.services',
    'jsonForms.verticalLayout',
    'jsonForms.horizontalLayout',
    'jsonForms.label',
    'jsonForms.control',
    'jsonForms.table',
    'jsonForms.dataServices',
    'jsonForms.directives'
]);

// Source: js/directives.js
var jsonFormsDirectives = angular.module('jsonForms.directives', []);

jsonFormsDirectives.directive('jsonforms',
    ['RenderService', 'ReferenceResolver',
        function(RenderService, ReferenceResolver) {

    return {
        restrict: "E",
        replace: true,
        scope: {
            schema: "=",
            uiSchema: "=",
            data: "=",
            asyncDataProvider: "="
        },
        // TODO: fix template for tests
        templateUrl: 'templates/form.html',
        controller: ['$scope', function($scope) {

            // TODO: call syntax
            var schema = $scope.schema;
            var uiSchema = $scope.uiSchema;
            var dataProvider = $scope.asyncDataProvider;

            schema["uiSchema"] = uiSchema;
            ReferenceResolver.addToMapping(jsonRefs.findRefs(uiSchema));

            if (dataProvider !== undefined) {
                dataProvider.fetchData().$promise.then(function(data) {
                    jsonRefs.resolveRefs(schema, {}, function (err, resolvedSchema, meta) {
                        $scope.elements = RenderService.renderAll(schema, resolvedSchema["uiSchema"], data, $scope.asyncDataProvider);
                    });
                });
            } else {
                var data = $scope.data;
                jsonRefs.resolveRefs(schema, {}, function (err, resolvedSchema, meta) {
                    $scope.elements = RenderService.renderAll(schema, resolvedSchema["uiSchema"], data);
                });
            }


            //$scope.bindings = BindingService.all();
            $scope.opened = false;

            $scope.openDate = function($event, element) {
                $event.preventDefault();
                $event.stopPropagation();

                element.isOpen = true;
            };

            $scope.validateNumber = function(value, element) {
                if (value !== undefined && value !== null && isNaN(value)) {
                    element.alerts = [];
                    var alert = {
                        type: 'danger',
                        msg: 'Must be a valid number!'
                    };
                    element.alerts.push(alert);
                    return false;
                }
                else if (json['type'] === 'VerticalLayout') {
                    return new VerticalLayout(children);
                }
            }
            else if (json.hasOwnProperty('scope')) {
                if (json['type'] === 'Control') {
                    return new Control(json['label'], json['scope']['$ref']);
                }
            }
            console.log("unmatched " + JSON.stringify((json)));
            return new Label(json['text']);
        };
        return Json;
    })();
    jsonforms.Json = Json;
    var HorizontalLayout = (function () {
        function HorizontalLayout(elements) {
            this.id = 'HorizontalLayout';
            this.elements = elements;
        }
        return HorizontalLayout;
    })();
    jsonforms.HorizontalLayout = HorizontalLayout;
    var VerticalLayout = (function () {
        function VerticalLayout(elements) {
            this.id = 'VerticalLayout';
            this.elements = elements;
        }
        return VerticalLayout;
    })();
    jsonforms.VerticalLayout = VerticalLayout;
    var JSONPointer = (function () {
        function JSONPointer(path) {
            this.fragments = path.split("/");
        }
        return JSONPointer;
    })();
    jsonforms.JSONPointer = JSONPointer;
})(jsonforms || (jsonforms = {}));
/// <reference path="../typings/angularjs/angular.d.ts"/>
/// <reference path="./jsonforms.ts"/>
var RenderService = (function () {
    function RenderService() {
        //renderers = { [id: string]: IRenderer } = {};
        this.renderers = {};
    }
    RenderService.prototype.$get = function () {
        var _this = this;
        return {
            render: function (element, schema, instance, path, dataProvider) {
                var renderer = _this.renderers[element.id];
                return renderer.render(element, schema, instance, path, dataProvider);
            },
            hasRendererFor: function (element) {
                return _this.renderers.hasOwnProperty(element.id);
            },
            renderAll: function (schema, uiSchema, instance, dataProvider) {
                var result = [];
                if (uiSchema.elements === undefined) {
                    return result;
                }
                var uiElements = uiSchema.elements;
                var basePath = "#/elements/";
                for (var i = 0; i < uiElements.length; i++) {
                    var uiElement = uiElements[i];
                    var path = basePath + i;
                    if (_this.$get().hasRendererFor(uiElement)) {
                        var renderedElement = _this.$get().render(uiElement, schema, instance, path, dataProvider);
                        result.push(renderedElement);
                    }
                }
                return result;
            },
            register: function (renderer) {
                _this.renderers[renderer.id] = renderer;
            }
        };
    };
    return RenderService;
})();
angular.module('jsonForms.services', []).factory('ReferenceResolver', function () {
    var referenceMap = {};
    var keywords = ["items", "properties", "#"];
    function toPropertyFragments(path) {
        return path.split('/').filter(function (fragment) {
            return fragment.length > 0;
        });
    }
    function filterNonKeywords(fragments) {
        return fragments.filter(function (fragment) {
            return !(keywords.indexOf(fragment) !== -1);
        });
    }
    return {
        addToMapping: function (addition) {
            for (var ref in addition) {
                if (addition.hasOwnProperty(ref)) {
                    referenceMap[ref] = addition[ref];
                }
            }
        },
        get: function (uiSchemaPath) {
            return referenceMap[uiSchemaPath + "/scope/$ref"];
        },
        normalize: function (path) {
            // TODO: provide filterKeywords function
            return filterNonKeywords(toPropertyFragments(path)).join("/");
        },
        /**
         * Takes an JSON object and a schema path and resolve the schema path against the instance.
         * @param instance a JSON object
         * @param path a valid JSON path expression
         * @returns the dereferenced value
         */
        resolve: function (instance, path) {
            var p = path + "/scope/$ref";
            if (referenceMap !== undefined && referenceMap.hasOwnProperty(p)) {
                p = referenceMap[p];
            }
            return this.resolveModelPath(instance, p);
        },
        resolveModelPath: function (instance, path) {
            var fragments = toPropertyFragments(this.normalize(path));
            return fragments.reduce(function (currObj, fragment) {
                if (currObj instanceof Array) {
                    return currObj.map(function (item) {
                        return item[fragment];
                    });
                }
                return currObj[fragment];
            }, instance);
        }
    };
}).provider('RenderService', RenderService);
/// <reference path="../../typings/angularjs/angular.d.ts"/>
var app = angular.module('jsonForms.control', []);
app.run(['RenderService', 'BindingService', 'ReferenceResolver',
    function (RenderService, BindingService, ReferenceResolver) {
        RenderService.register({
            id: "Control",
            render: function (resolvedElement, schema, instance, path) {
                var control = {};
                control["schemaType"] = resolvedElement.scope !== undefined ? resolvedElement.scope.type : "";
                control["bindings"] = instance;
                control["path"] = ReferenceResolver.normalize(ReferenceResolver.get(path));
                control["label"] = resolvedElement.label;
                // TODO: create unique ID?
                control["id"] = path;
                return {
                    "type": "Control",
                    "elements": [control],
                    "size": 99
                };
            }
        });
    }]);
/// <reference path="../../typings/angularjs/angular.d.ts"/>
var app = angular.module('jsonForms.horizontalLayout', []);
app.run(['RenderService', function (RenderService) {
        RenderService.register({
            id: "HorizontalLayout",
            render: function (horizontalLayoutElement, schema, instance, path, dataProvider) {
                var renderElements = function (elements) {
                    if (elements === undefined || elements.length == 0) {
                        return [];
                    }
                    else {
                        var basePath = path + "/elements/";
                        return elements.reduce(function (acc, curr, idx, els) {
                            acc.push(RenderService.render(curr, schema, instance, basePath + idx, dataProvider));
                            return acc;
                        }, []);
                    }
                };
                // TODO
                var maxSize = 99;
                var renderedElements = renderElements(horizontalLayoutElement.elements);
                var size = renderedElements.length;
                var individualSize = Math.floor(maxSize / size);
                for (var j = 0; j < renderedElements.length; j++) {
                    renderedElements[j].size = individualSize;
                }
                return {
                    "type": "HorizontalLayout",
                    "elements": renderedElements,
                    "size": maxSize
                };
            }
        });
    }]);
/// <reference path="../../typings/angularjs/angular.d.ts"/>
var app = angular.module('jsonForms.label', []);
app.run(['RenderService', 'ReferenceResolver', function (RenderService, ReferenceResolver) {
        RenderService.register({
            id: "Label",
            render: function (uiElement, schema, instance, path, dataProvider) {
                var label = {};
                label["text"] = uiElement.text;
                return {
                    "type": "Label",
                    "elements": [label],
                    // TODO
                    "size": 99
                };
            }
        });
    }]);

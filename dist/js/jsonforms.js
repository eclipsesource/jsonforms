(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*! jsonforms - v0.0.1 - 2015-08-24 Copyright (c) EclipseSource Muenchen GmbH and others. */ 
'use strict';
// Source: js/app.js
/// <reference path="../typings/angularjs/angular.d.ts"/>
angular.module('jsonForms', [
    'ui.bootstrap',
    'ui.validate',
    'ui.grid',
    'ui.grid.pagination',
    'ui.grid.autoResize',
    'jsonForms.services',
    'jsonForms.directives',
    'jsonForms.label',
    'jsonForms.verticalLayout',
    'jsonForms.horizontalLayout',
    'jsonForms.table',
    'jsonForms.integerControl',
    'jsonForms.booleanControl',
    'jsonForms.stringControl',
    'jsonForms.numberControl',
    'jsonForms.datetimeControl',
    'jsonForms.enumControl',
]);

// Source: js/directives.js
/// <reference path="../typings/angularjs/angular.d.ts"/>
/// <reference path="./services.ts"/>
var jsonFormsDirectives = angular.module('jsonForms.directives', ['jsonForms.services']);
var JsonFormsDiretiveController = (function () {
    function JsonFormsDiretiveController(RenderService, ReferenceResolver, SchemaGenerator, UISchemaGenerator, $scope, $q) {
        this.RenderService = RenderService;
        this.ReferenceResolver = ReferenceResolver;
        this.SchemaGenerator = SchemaGenerator;
        this.UISchemaGenerator = UISchemaGenerator;
        this.$scope = $scope;
        this.$q = $q;
        var resolvedSchemaDeferred = $q.defer();
        var resolvedUISchemaDeferred = $q.defer();
        $q.all([this.fetchSchema().promise, this.fetchUiSchema().promise]).then(function (values) {
            var schema = values[0];
            var uiSchemaMaybe = values[1];
            var uiSchemaDeferred = $q.defer();
            $q.when(uiSchemaDeferred.promise).then(function (uiSchema) {
                schema['uiSchema'] = uiSchema;
                //  build mapping of ui paths to schema refs
                //ReferenceResolver.addUiPathToSchemaRefMapping(JsonRefs.findRefs(uiSchema));
                JsonRefs.resolveRefs(schema, {}, function (err, resolvedSchema, meta) {
                    resolvedSchemaDeferred.resolve(resolvedSchema);
                    // TODO: ui schema is now unresolved
                    resolvedUISchemaDeferred.resolve(uiSchema); //resolvedSchema['uiSchema']);
                });
            });
            if (uiSchemaMaybe === undefined || uiSchemaMaybe === null || uiSchemaMaybe === "") {
                // resolve JSON schema, then generate ui Schema
                JsonRefs.resolveRefs(schema, {}, function (err, resolvedSchema, meta) {
                    var uiSchema = UISchemaGenerator.generateDefaultUISchema(resolvedSchema);
                    uiSchemaDeferred.resolve(uiSchema);
                });
            }
            else {
                // directly resolve ui schema
                uiSchemaDeferred.resolve(uiSchemaMaybe);
            }
        });
        $q.all([resolvedSchemaDeferred.promise, resolvedUISchemaDeferred.promise, this.fetchData()]).then(function (values) {
            var schema = values[0];
            var uiSchema = values[1];
            var data = values[2];
            var dataProvider;
            if ($scope.asyncDataProvider) {
                dataProvider = $scope.asyncDataProvider;
            }
            else {
                dataProvider = new jsonforms.services.DefaultDataProvider($q, data);
            }
            RenderService.registerSchema(schema);
            $scope['elements'] = [RenderService.render(uiSchema, dataProvider)];
        });
        // TODO: check if still in use
        $scope['opened'] = false;
    }
    JsonFormsDiretiveController.prototype.fetchSchema = function () {
        if (this.$scope.schema && this.$scope.asyncSchema()) {
            throw new Error("You cannot specify both the 'schema' and the 'async-schema' attribute at the same time.");
        }
        else if (this.$scope.schema) {
            var p = this.$q.defer();
            p.resolve(this.$scope.schema);
            return p;
        }
        else if (this.$scope.asyncSchema()) {
            return this.$scope.asyncSchema();
        }
        else if (this.$scope.data) {
            var p = this.$q.defer();
            p.resolve(this.SchemaGenerator.generateDefaultSchema(this.$scope.data));
            return p;
        }
        throw new Error("Either the 'schema' or the 'async-schema' attribute must be specified.");
    };
    JsonFormsDiretiveController.prototype.fetchUiSchema = function () {
        if (this.$scope.uiSchema && this.$scope.asyncUiSchema()) {
            throw new Error("You cannot specify both the 'ui-schema' and the 'async-ui-schema' attribute at the same time.");
        }
        else if (this.$scope.uiSchema) {
            var p = this.$q.defer();
            p.resolve(this.$scope.uiSchema);
            return p;
        }
        else if (this.$scope.asyncUiSchema()) {
            return this.$scope.asyncUiSchema();
        }
        // return undefined to indicate that no way of obtaining a ui schema was defined
        // TODO: Maybe return defaultUISchema or generator function?
        var p = this.$q.defer();
        p.resolve(undefined);
        return p;
    };
    JsonFormsDiretiveController.prototype.fetchData = function () {
        var dataProvider = this.$scope.asyncDataProvider;
        var data = this.$scope.data;
        if (dataProvider && data) {
            throw new Error("You cannot specify both the 'data' and the 'async-data-provider' attribute at the same time.");
        }
        else if (dataProvider) {
            var prom = dataProvider.fetchData();
            return prom;
        }
        else if (this.$scope.data) {
            var p = this.$q.defer();
            p.resolve(this.$scope.data);
            return p.promise;
        }
        throw new Error("Either the 'data' or the 'async-data-provider' attribute must be specified.");
    };
    JsonFormsDiretiveController.$inject = ['RenderService', 'ReferenceResolver', 'SchemaGenerator', 'UISchemaGenerator', '$scope', '$q'];
    return JsonFormsDiretiveController;
})();
var RecElement = (function () {
    function RecElement(recursionHelper) {
        var _this = this;
        this.recursionHelper = recursionHelper;
        this.restrict = "E";
        this.replace = true;
        this.scope = {
            element: '=',
            bindings: '=',
            topOpenDate: '=',
            topValidateNumber: '=',
            topValidateInteger: '='
        };
        this.templateUrl = 'templates/element.html';
        this.compile = function (element, attr, trans) {
            return _this.recursionHelper.compile(element, trans);
        };
    }
    return RecElement;
})();
jsonFormsDirectives.directive('control', function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            control: '=',
            bindings: '=',
            topOpenDate: '=',
            topValidateNumber: '=',
            topValidateInteger: '='
        },
        templateUrl: 'templates/control.html'
    };
}).directive('jsonforms', function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            schema: '=',
            uiSchema: '=',
            data: '=',
            asyncSchema: '&',
            asyncUiSchema: '&',
            asyncDataProvider: '='
        },
        // TODO: fix template for tests
        templateUrl: 'templates/form.html',
        controller: JsonFormsDiretiveController
    };
}).directive('recelement', ['RecursionHelper', function (recHelper) {
        return new RecElement(recHelper);
    }]).directive('dynamicWidget', ['$compile', function ($compile) {
        return {
            restrict: 'E',
            scope: {
                element: "="
            },
            replace: true,
            link: function (scope, element) {
                if (scope.element.templateUrl) {
                    $.get(scope.element.templateUrl, function (template) {
                        var compiledTemplate = $compile(template.replace("data-jsonforms-model", "ng-model='element.instance[element.path]'"))(scope);
                        element.replaceWith(compiledTemplate);
                    });
                }
                else {
                    var template = $compile(scope.element.template.replace("data-jsonforms-model", "ng-model='element.instance[element.path]'"))(scope);
                    element.replaceWith(template);
                }
            }
        };
    }]);

// Source: js/renderers/ArrayControl.js
/// <reference path="../../typings/angularjs/angular.d.ts"/>
/// <reference path="../services.ts"/>
var ArrayControl = (function () {
    function ArrayControl(refResolver, scope) {
        this.refResolver = refResolver;
        this.scope = scope;
        this.maxSize = 99;
        this.priority = 2;
    }
    ArrayControl.prototype.isApplicable = function (element, subSchema, schemaPath) {
        return element.type == 'Control' && subSchema.type == 'array';
    };
    ArrayControl.prototype.render = function (element, subSchema, schemaPath, dataProvider) {
        var control = this.createTableUIElement(element, dataProvider);
        dataProvider.fetchData().then(function (data) {
            control['tableOptions'].gridOptions.data = data;
        });
        return {
            "label": element.label,
            "type": "Control",
            "tableOptions": control['tableOptions'],
            "size": this.maxSize,
            "template": "<div ui-grid=\"element['tableOptions']\"></div>"
        };
    };
    //private resolveColumnData(uiPath, data) {
    //    if (data instanceof Array) {
    //        return data;
    //    } else {
    //        // relative scope
    //        return this.refResolver.resolveUi(data, uiPath);
    //    }
    //}
    ArrayControl.prototype.createTableUIElement = function (element, dataProvider) {
        // TODO: how to configure paging/filtering
        var paginationEnabled = dataProvider.fetchPage !== undefined;
        var filteringEnabled = false;
        var uiElement = {
            schemaType: "array"
        };
        //var parentScope = this.refResolver.getSchemaRef(path);
        var that = this;
        //var prefix = this.refResolver.normalize(parentScope);
        //var colDefs = element.columns.map(function(col, idx) {
        //    return {
        //        field:  that.refResolver.normalize(that.refResolver.getSchemaRef(path + "/columns/" + idx)).replace(prefix + "/", ''),
        //        displayName: col.label
        //    }
        //});
        var tableOptions = {
            columns: element.columns,
            gridOptions: {
                enableFiltering: filteringEnabled,
                enablePaginationControls: paginationEnabled,
                enableColumnResizing: true,
                enableAutoResize: true,
                // TODO: make cell clickable somehow
                //columnDefs: colDefs,
                data: [],
                useExternalFiltering: true
            }
        };
        if (paginationEnabled) {
            tableOptions['gridOptions']['enablePagination'] = paginationEnabled;
            tableOptions['gridOptions']['useExternalPagination'] = true;
            // TODO: dummies
            tableOptions['gridOptions']['paginationPageSizes'] = [1, 2, 3, 4, 5];
            tableOptions['gridOptions']['paginationPageSize'] = 1;
            tableOptions['gridOptions']['paginationPage'] = 1;
        }
        // TODO:
        //var firstColumnDef = tableOptions.gridOptions.columnDefs[0];
        //firstColumnDef.cellTemplate = firstColumnDef.cellTemplate.replace("<<TYPE>>", path);
        // convenience methods --
        uiElement['enablePaginationControls'] = function () {
            tableOptions.gridOptions.enablePaginationControls = true;
        };
        uiElement['disablePaginationControls'] = function () {
            tableOptions.gridOptions.enablePaginationControls = false;
        };
        uiElement['setTotalItems'] = function () {
            // TODO: determine total items
        };
        tableOptions.gridOptions['onRegisterApi'] = function (gridApi) {
            //gridAPI = gridApi;
            gridApi.pagination.on.paginationChanged(that.scope, function (newPage, pageSize) {
                tableOptions.gridOptions['paginationPage'] = newPage;
                tableOptions.gridOptions['paginationPageSize'] = pageSize;
                dataProvider.setPageSize(pageSize);
                dataProvider.fetchPage(newPage, pageSize).$promise.then(function (newData, headers) {
                    tableOptions.gridOptions.data = newData; //this.resolveColumnData(path, newData, colDefs);
                });
            });
        };
        uiElement['tableOptions'] = tableOptions;
        return uiElement;
    };
    ArrayControl.prototype.findSearchTerms = function (grid) {
        var searchTerms = [];
        for (var i = 0; i < grid.columns.length; i++) {
            var searchTerm = grid.columns[i].filters[0].term;
            if (searchTerm !== undefined && searchTerm !== null) {
                searchTerms.push({
                    column: grid.columns[i].name,
                    term: searchTerm
                });
            }
        }
        return searchTerms;
    };
    return ArrayControl;
})();
var app = angular.module('jsonForms.table', []);
app.run(['RenderService', 'ReferenceResolver', '$rootScope', function (RenderService, ReferenceResolver, $rootScope) {
        RenderService.register(new ArrayControl(ReferenceResolver, $rootScope));
    }]);

// Source: js/renderers/BooleanControl.js
///<reference path="..\services.ts"/>
var BooleanControl = (function () {
    function BooleanControl(refResolver) {
        this.refResolver = refResolver;
        this.priority = 2;
    }
    BooleanControl.prototype.render = function (element, subSchema, schemaPath, dataProvider) {
        return {
            "type": "Control",
            "size": 99,
            "label": element['label'],
            path: [this.refResolver.normalize(schemaPath)],
            "instance": dataProvider.data,
            "template": "<div class=\"checkbox-inline\">\n            <input type=\"checkbox\" id=\"" + schemaPath + "\" class=\"qb-control qb-control-boolean\" data-jsonforms-model/>\n            </div>"
        };
    };
    BooleanControl.prototype.isApplicable = function (uiElement, subSchema, schemaPath) {
        return uiElement.type == 'Control' && subSchema.type == 'boolean';
    };
    return BooleanControl;
})();
var app = angular.module('jsonForms.booleanControl', []);
app.run(['RenderService', 'ReferenceResolver', function (RenderService, ReferenceResolver) {
        RenderService.register(new BooleanControl(ReferenceResolver));
    }]);

// Source: js/renderers/DatetimeControl.js
///<reference path="..\services.ts"/>
var DatetimeControl = (function () {
    function DatetimeControl(refResolver) {
        this.refResolver = refResolver;
        this.priority = 3;
    }
    DatetimeControl.prototype.render = function (element, subSchema, schemaPath, dataProvider) {
        //var path = this.refResolver.normalize(this.refResolver.getSchemaRef(uiPath));
        var options = {
            "type": "Control",
            "size": 99,
            "label": element['label'],
            "path": [this.refResolver.normalize(schemaPath)],
            "instance": dataProvider.data,
            "isOpen": false,
            // TODO: pefix
            "templateUrl": '../templates/datetime.html',
            openDate: function ($event) {
                $event.preventDefault();
                $event.stopPropagation();
                options.isOpen = true;
            }
        };
        return options;
    };
    DatetimeControl.prototype.isApplicable = function (uiElement, subSchema, schemaPath) {
        return uiElement.type == 'Control' && subSchema.type == "string" &&
            subSchema['format'] != undefined && subSchema['format'] == "date-time";
    };
    return DatetimeControl;
})();
var app = angular.module('jsonForms.datetimeControl', []);
app.run(['RenderService', 'ReferenceResolver', '$rootScope', function (RenderService, ReferenceResolver, $scope) {
        RenderService.register(new DatetimeControl((ReferenceResolver)));
    }]);

// Source: js/renderers/EnumControl.js
///<reference path="..\services.ts"/>
var EnumControl = (function () {
    function EnumControl(refResolver) {
        this.refResolver = refResolver;
        this.priority = 3;
    }
    EnumControl.prototype.render = function (element, subSchema, schemaPath, dataProvider) {
        var enums = subSchema.enum;
        var result = {
            "type": "Control",
            "size": 99,
            "label": element['label'],
            "path": [this.refResolver.normalize(schemaPath)],
            "instance": dataProvider.data,
            "options": enums,
            "template": "<select ng-options=\"option as option for option in element.options\" id=\"" + schemaPath + "\" class=\"form-control qb-control qb-control-enum\" data-jsonforms-model ></select>"
        };
        return result;
    };
    EnumControl.prototype.isApplicable = function (uiElement, subSchema, schemaPath) {
        // TODO: enum are valid for any instance type, not just strings
        return uiElement.type == 'Control' && subSchema.hasOwnProperty('enum');
    };
    return EnumControl;
})();
var app = angular.module('jsonForms.enumControl', []);
app.run(['RenderService', 'ReferenceResolver', function (RenderService, ReferenceResolver) {
        RenderService.register(new EnumControl((ReferenceResolver)));
    }]);

// Source: js/renderers/HorizontalLayout.js
/// <reference path="../../typings/angularjs/angular.d.ts"/>
/// <reference path="../services.ts"/>
var HorizontalLayout = (function () {
    function HorizontalLayout(renderServ) {
        var _this = this;
        this.renderServ = renderServ;
        this.priority = 1;
        this.render = function (element, subSchema, schemaPath, dataProvider) {
            var that = _this;
            var renderElements = function (elements) {
                if (elements === undefined || elements.length == 0) {
                    return [];
                }
                else {
                    return elements.reduce(function (acc, curr, idx, els) {
                        acc.push(that.renderServ.render(curr, dataProvider));
                        return acc;
                    }, []);
                }
            };
            // TODO
            var maxSize = 99;
            var renderedElements = renderElements(element.elements);
            var size = renderedElements.length;
            var individualSize = Math.floor(maxSize / size);
            for (var j = 0; j < renderedElements.length; j++) {
                renderedElements[j].size = individualSize;
            }
            return {
                "type": "Layout",
                "elements": renderedElements,
                "size": maxSize,
                "template": "<fieldset class=\"col-sm-{{element.size}}\">\n                  <div class=\"row\">\n                    <recelement ng-repeat=\"child in element.elements\"\n                                element=\"child\"\n                                bindings=\"bindings\"\n                                top-open-date=\"topOpenDate\"\n                                top-validate-number=\"topValidateNumber\"\n                                top-validate-integer=\"topValidateInteger\">\n                    </recelement>\n                  </div>\n                </fieldset>"
            };
        };
    }
    HorizontalLayout.prototype.isApplicable = function (uiElement, jsonSchema, schemaPath) {
        return uiElement.type == "HorizontalLayout";
    };
    return HorizontalLayout;
})();
var app = angular.module('jsonForms.horizontalLayout', []);
app.run(['RenderService', function (RenderService) {
        RenderService.register(new HorizontalLayout(RenderService));
    }]);

// Source: js/renderers/IntegerControl.js
///<reference path="..\services.ts"/>
var IntegerControl = (function () {
    function IntegerControl(refResolver) {
        this.refResolver = refResolver;
        this.priority = 2;
    }
    IntegerControl.prototype.render = function (element, subSchema, schemaPath, dataProvider) {
        //var path = this.refResolver.normalize(this.refResolver.getSchemaRef(uiPath));
        //var id = path;
        var options = {
            "type": "Control",
            "size": 99,
            "label": element['label'],
            path: [this.refResolver.normalize(schemaPath)],
            "instance": dataProvider.data,
            "template": "<input type=\"text\" id=\"" + schemaPath + "\" class=\"form-control qb-control qb-control-integer\" ui-validate=\"'element.validate($value)'\" data-jsonforms-model/>",
            "alerts": [],
            validate: function (value) {
                if (value !== undefined && value !== null && (isNaN(value) || (value !== "" && !(/^\d+$/.test(value))))) {
                    options.alerts = [];
                    var alert = {
                        type: 'danger',
                        msg: 'Must be a valid integer!'
                    };
                    options.alerts.push(alert);
                    return false;
                }
                options.alerts = [];
                return true;
            }
        };
        dataProvider.fetchData().then(function (data) {
            options['instance'] = data;
        });
        return options;
    };
    IntegerControl.prototype.isApplicable = function (uiElement, subSchema, schemaPath) {
        //var subSchema = this.refResolver.resolveSchema(jsonSchema, schemaPath);
        //if (subSchema == undefined) {
        //    return false;
        //}
        return uiElement.type == 'Control' && subSchema.type == 'integer';
    };
    return IntegerControl;
})();
var app = angular.module('jsonForms.integerControl', []);
app.run(['RenderService', 'ReferenceResolver', function (RenderService, ReferenceResolver) {
        RenderService.register(new IntegerControl((ReferenceResolver)));
    }]);

// Source: js/renderers/NumberControl.js
///<reference path="..\services.ts"/>
var NumberControl = (function () {
    function NumberControl(refResolver, scope) {
        this.refResolver = refResolver;
        this.scope = scope;
        this.priority = 2;
    }
    NumberControl.prototype.render = function (element, subSchema, schemaPath, dataProvider) {
        var options = {
            "type": "Control",
            "size": 99,
            "label": element['label'],
            "path": [this.refResolver.normalize(schemaPath)],
            "instance": dataProvider.data,
            "template": "<input type=\"text\" id=\"" + schemaPath + "\" class=\"form-control qb-control qb-control-number\" ui-validate=\"'element.validate($value)'\" data-jsonforms-model=\"\"/>",
            alerts: [{ "type": "danger", "msg": "Must be a valid number!" }],
            validate: function (value) {
                if (value !== undefined && value !== null && isNaN(value)) {
                    options.alerts = [];
                    var alert = {
                        type: 'danger',
                        msg: 'Must be a valid number!'
                    };
                    options.alerts.push(alert);
                    return false;
                }
                options.alerts = [];
                return true;
            }
        };
        return options;
    };
    NumberControl.prototype.isApplicable = function (uiElement, subSchema, schemaPath) {
        return uiElement.type == 'Control' && subSchema.type == 'number';
    };
    return NumberControl;
})();
var app = angular.module('jsonForms.numberControl', []);
app.run(['RenderService', 'ReferenceResolver', '$rootScope', function (RenderService, ReferenceResolver, scope) {
        RenderService.register(new NumberControl(ReferenceResolver, scope));
    }]);

// Source: js/renderers/StringControl.js
///<reference path="..\services.ts"/>
var StringControl = (function () {
    function StringControl(refResolver) {
        this.refResolver = refResolver;
        this.priority = 2;
    }
    StringControl.prototype.render = function (element, subSchema, schemaPath, dataProvider) {
        var result = {
            "type": "Control",
            "size": 99,
            "label": element['label'],
            "path": [this.refResolver.normalize(schemaPath)],
            "instance": dataProvider.data,
            "template": "<input type=\"text\" id=\"" + schemaPath + "\" class=\"form-control qb-control qb-control-string\" data-jsonforms-model/>",
            "alerts": []
        };
        dataProvider.fetchData().then(function (data) {
            result['instance'] = data;
        });
        return result;
    };
    StringControl.prototype.isApplicable = function (uiElement, subSchema, schemaPath) {
        return uiElement.type == 'Control' && subSchema.type == 'string';
    };
    return StringControl;
})();
var app = angular.module('jsonForms.stringControl', []);
app.run(['RenderService', 'ReferenceResolver', function (RenderService, ReferenceResolver) {
        RenderService.register(new StringControl((ReferenceResolver)));
    }]);

// Source: js/renderers/VerticalLayout.js
/// <reference path="../../typings/angularjs/angular.d.ts"/>
/// <reference path="../services.ts"/>
var VerticalLayout = (function () {
    function VerticalLayout(renderService) {
        this.renderService = renderService;
        this.priority = 1;
    }
    VerticalLayout.prototype.render = function (element, subSchema, schemaPath, dataProvider) {
        var that = this;
        var renderElements = function (elements) {
            if (elements === undefined || elements.length == 0) {
                return [];
            }
            else {
                return elements.reduce(function (acc, curr, idx, els) {
                    acc.push(that.renderService.render(curr, dataProvider));
                    return acc;
                }, []);
            }
        };
        var renderedElements = renderElements(element.elements);
        return {
            "type": "Layout",
            "elements": renderedElements,
            "size": 99,
            "template": "<fieldset class=\"col-sm-{{element.size}}\">\n                    <recelement ng-repeat=\"child in element.elements\"\n                                element=\"child\"\n                                bindings=\"bindings\"\n                                top-open-date=\"topOpenDate\"\n                                top-validate-number=\"topValidateNumber\"\n                                top-validate-integer=\"topValidateInteger\">\n                    </recelement>\n                </fieldset>"
        };
    };
    VerticalLayout.prototype.isApplicable = function (uiElement, jsonSchema, schemaPath) {
        return uiElement.type == "VerticalLayout";
    };
    return VerticalLayout;
})();
var app = angular.module('jsonForms.verticalLayout', ['jsonForms.services']);
app.run(['RenderService', function (RenderService) {
        RenderService.register(new VerticalLayout(RenderService));
    }]);

// Source: js/renderers/label.js
/// <reference path="../../typings/angularjs/angular.d.ts"/>
/// <reference path="../services.ts"/>
var Label = (function () {
    function Label() {
        this.priority = 1;
    }
    Label.prototype.render = function (element, subSchema, schemaPath, dataProvider) {
        var text = element['text'];
        var size = 99;
        return {
            "type": "Widget",
            "size": size,
            "template": " <div class=\"qb-label\">{{text}}</div>"
        };
    };
    Label.prototype.isApplicable = function (element) {
        return element.type == "Label";
    };
    return Label;
})();
var app = angular.module('jsonForms.label', ['jsonForms.services']);
app.run(['RenderService', function (RenderService) {
        RenderService.register(new Label());
    }]);

// Source: js/services.js
/// <reference path="../typings/angularjs/angular.d.ts"/>
/// <reference path="../typings/schemas/uischema.d.ts"/>
/// <reference path="../typings/schemas/jsonschema.d.ts"/>
var jsonforms;
(function (jsonforms) {
    var services;
    (function (services) {
        var UISchemaElement = (function () {
            function UISchemaElement(json) {
                this.json = json;
                this.type = json['type'];
                this.elements = json['elements'];
            }
            return UISchemaElement;
        })();
        services.UISchemaElement = UISchemaElement;
        var DefaultDataProvider = (function () {
            function DefaultDataProvider($q, data) {
                var _this = this;
                this.$q = $q;
                this.data = data;
                this.setPageSize = function () {
                };
                this.fetchPage = function (page, size) {
                    var p = _this.$q.defer();
                    return p.promise;
                };
            }
            DefaultDataProvider.prototype.fetchData = function () {
                var p = this.$q.defer();
                p.resolve(this.data);
                return p.promise;
            };
            return DefaultDataProvider;
        })();
        services.DefaultDataProvider = DefaultDataProvider;
        // TODO: EXPORT
        var RenderService = (function () {
            function RenderService(refResolver) {
                var _this = this;
                this.refResolver = refResolver;
                this.renderers = [];
                this.registerSchema = function (schema) {
                    _this.schema = schema;
                };
                this.render = function (element, dataProvider) {
                    var foundRenderer;
                    var schemaPath;
                    var subSchema;
                    // TODO element must be IControl
                    if (element['scope']) {
                        schemaPath = element['scope']['$ref'];
                        subSchema = _this.refResolver.resolveSchema(_this.schema, schemaPath);
                    }
                    for (var i = 0; i < _this.renderers.length; i++) {
                        if (_this.renderers[i].isApplicable(element, subSchema, schemaPath)) {
                            if (foundRenderer == undefined || _this.renderers[i].priority > foundRenderer.priority) {
                                foundRenderer = _this.renderers[i];
                            }
                        }
                    }
                    if (foundRenderer === undefined) {
                        throw new Error("No applicable renderer found for element " + JSON.stringify(element));
                    }
                    return foundRenderer.render(element, subSchema, schemaPath, dataProvider);
                };
                this.register = function (renderer) {
                    _this.renderers.push(renderer);
                };
            }
            RenderService.$inject = ['ReferenceResolver'];
            return RenderService;
        })();
        services.RenderService = RenderService;
        var ReferenceResolver = (function () {
            // $compile can then be used as this.$compile
            function ReferenceResolver($compile) {
                var _this = this;
                this.$compile = $compile;
                this.pathMapping = {};
                this.Keywords = ["items", "properties", "#"];
                this.addUiPathToSchemaRefMapping = function (addition) {
                    for (var ref in addition) {
                        if (addition.hasOwnProperty(ref)) {
                            _this.pathMapping[ref] = addition[ref];
                        }
                    }
                };
                this.getSchemaRef = function (uiSchemaPath) {
                    if (uiSchemaPath == "#") {
                        return "#";
                    }
                    return _this.pathMapping[uiSchemaPath + "/scope/$ref"];
                };
                this.normalize = function (path) {
                    return _this.filterNonKeywords(_this.toPropertyFragments(path)).join("/");
                };
                this.resolveUi = function (instance, uiPath) {
                    var p = uiPath + "/scope/$ref";
                    if (_this.pathMapping !== undefined && _this.pathMapping.hasOwnProperty(p)) {
                        p = _this.pathMapping[p];
                    }
                    return _this.resolveInstance(instance, p);
                };
                this.resolveInstance = function (instance, path) {
                    var fragments = _this.toPropertyFragments(_this.normalize(path));
                    return fragments.reduce(function (currObj, fragment) {
                        if (currObj instanceof Array) {
                            return currObj.map(function (item) {
                                return item[fragment];
                            });
                        }
                        return currObj[fragment];
                    }, instance);
                };
                this.resolveSchema = function (schema, path) {
                    var fragments = _this.toPropertyFragments(path);
                    return fragments.reduce(function (subSchema, fragment) {
                        if (fragment == "#") {
                            return subSchema;
                        }
                        else if (subSchema instanceof Array) {
                            return subSchema.map(function (item) {
                                return item[fragment];
                            });
                        }
                        return subSchema[fragment];
                    }, schema);
                };
                this.toPropertyFragments = function (path) {
                    return path.split('/').filter(function (fragment) {
                        return fragment.length > 0;
                    });
                };
                this.filterNonKeywords = function (fragments) {
                    var that = _this;
                    return fragments.filter(function (fragment) {
                        return !(that.Keywords.indexOf(fragment) !== -1);
                    });
                };
            }
            ReferenceResolver.$inject = ["$compile"];
            return ReferenceResolver;
        })();
        services.ReferenceResolver = ReferenceResolver;
        var SchemaGenerator = (function () {
            function SchemaGenerator() {
                var _this = this;
                this.generateDefaultSchema = function (instance) {
                    return _this.schemaObject(instance, _this.allowAdditionalProperties, _this.requiredProperties);
                };
                this.generateDefaultSchemaWithOptions = function (instance, allowAdditionalProperties, requiredProperties) {
                    return _this.schemaObject(instance, allowAdditionalProperties, requiredProperties);
                };
                this.schemaObject = function (instance, allowAdditionalProperties, requiredProperties) {
                    var properties = _this.properties(instance, allowAdditionalProperties, requiredProperties);
                    return {
                        "type": "object",
                        "properties": properties,
                        "additionalProperties": allowAdditionalProperties(properties),
                        "required": requiredProperties(_this.keys(properties))
                    };
                };
                this.properties = function (instance, allowAdditionalProperties, requiredProperties) {
                    var properties = {};
                    var generator = _this;
                    _this.keys(instance).forEach(function (property) {
                        properties[property] = generator.property(instance[property], allowAdditionalProperties, requiredProperties);
                    });
                    return properties;
                };
                this.keys = function (properties) {
                    return Object.keys(properties);
                };
                this.property = function (instance, allowAdditionalProperties, requiredProperties) {
                    switch (typeof instance) {
                        case "string":
                        case "boolean":
                            return { "type": typeof instance };
                        case "number":
                            if (Number(instance) % 1 === 0) {
                                return { "type": "integer" };
                            }
                            else {
                                return { "type": "number" };
                            }
                        case "object":
                            return _this.schemaObjectOrNullOrArray(instance, allowAdditionalProperties, requiredProperties);
                        default:
                            return {};
                    }
                };
                this.schemaObjectOrNullOrArray = function (instance, allowAdditionalProperties, requiredProperties) {
                    if (_this.isNotNull(instance)) {
                        if (_this.isArray(instance)) {
                            return _this.schemaArray(instance, allowAdditionalProperties, requiredProperties);
                        }
                        else {
                            return _this.schemaObject(instance, allowAdditionalProperties, requiredProperties);
                        }
                    }
                    else {
                        return { "type": "null" };
                    }
                };
                this.schemaArray = function (instance, allowAdditionalProperties, requiredProperties) {
                    if (instance.length) {
                        var generator = _this;
                        var allProperties = instance.map(function (object) {
                            return generator.property(object, allowAdditionalProperties, requiredProperties);
                        });
                        var uniqueProperties = _this.distinct(allProperties, function (object) { return JSON.stringify(object); });
                        if (uniqueProperties.length == 1) {
                            return {
                                "type": "array",
                                "items": uniqueProperties[0]
                            };
                        }
                        else {
                            return {
                                "type": "array",
                                "items": {
                                    "oneOf": uniqueProperties
                                }
                            };
                        }
                    }
                };
                this.isArray = function (instance) {
                    return Object.prototype.toString.call(instance) === '[object Array]';
                };
                this.isNotNull = function (instance) {
                    return (typeof (instance) !== 'undefined') && (instance !== null);
                };
                this.distinct = function (array, discriminator) {
                    var known = {};
                    return array.filter(function (item) {
                        var discriminatorValue = discriminator(item);
                        if (known.hasOwnProperty(discriminatorValue)) {
                            return false;
                        }
                        else {
                            return (known[discriminatorValue] = true);
                        }
                    });
                };
                this.requiredProperties = function (properties) {
                    return properties; // all known properties are required by default
                };
                this.allowAdditionalProperties = function (properties) {
                    return true; // allow other properties by default
                };
            }
            return SchemaGenerator;
        })();
        services.SchemaGenerator = SchemaGenerator;
        var UISchemaGenerator = (function () {
            function UISchemaGenerator() {
                var _this = this;
                this.generateDefaultUISchema = function (jsonSchema) {
                    var uiSchemaElements = [];
                    _this.generateUISchema(jsonSchema, uiSchemaElements, "#", "");
                    return uiSchemaElements[0];
                };
                this.generateUISchema = function (jsonSchema, schemaElements, currentRef, schemaName) {
                    var type = _this.deriveType(jsonSchema);
                    switch (type) {
                        case "object":
                            // Add a vertical layout with a label for the element name (if it exists)
                            var verticalLayout = {
                                type: "VerticalLayout",
                                elements: []
                            };
                            schemaElements.push(verticalLayout);
                            if (schemaName && schemaName !== "") {
                                // add label with name
                                var label = {
                                    type: "Label",
                                    text: _this.beautify(schemaName)
                                };
                                verticalLayout.elements.push(label);
                            }
                            // traverse properties
                            if (!jsonSchema.properties) {
                                // If there are no properties return
                                return;
                            }
                            var nextRef = currentRef + '/' + "properties";
                            for (var property in jsonSchema.properties) {
                                if (_this.isIgnoredProperty(property, jsonSchema.properties[property])) {
                                    continue;
                                }
                                _this.generateUISchema(jsonSchema.properties[property], verticalLayout.elements, nextRef + "/" + property, property);
                            }
                            break;
                        case "array":
                            var horizontalLayout = {
                                type: "HorizontalLayout",
                                elements: []
                            };
                            schemaElements.push(horizontalLayout);
                            var nextRef = currentRef + '/' + "items";
                            if (!jsonSchema.items) {
                                // If there are no items ignore the element
                                return;
                            }
                            //check if items is object or array
                            if (jsonSchema.items instanceof Array) {
                                for (var i = 0; i < jsonSchema.items.length; i++) {
                                    _this.generateUISchema(jsonSchema.items[i], horizontalLayout.elements, nextRef + '[' + i + ']', "");
                                }
                            }
                            else {
                                _this.generateUISchema(jsonSchema.items, horizontalLayout.elements, nextRef, "");
                            }
                            break;
                        case "string":
                        case "number":
                        case "integer":
                        case "boolean":
                            var controlObject = _this.getControlObject(_this.beautify(schemaName), currentRef);
                            schemaElements.push(controlObject);
                            break;
                        case "null":
                            //ignore
                            break;
                        default:
                            throw new Error("Unknown type: " + JSON.stringify(jsonSchema));
                    }
                };
                /**
                 * Determines if the property should be ignored because it is a meta property
                 */
                this.isIgnoredProperty = function (propertyKey, propertyValue) {
                    // could be a string (json-schema-id). Ignore in that case
                    return propertyKey === "id" && typeof propertyValue === "string";
                    // TODO ignore all meta keywords
                };
                /**
                 * Derives the type of the jsonSchema element
                 */
                this.deriveType = function (jsonSchema) {
                    if (jsonSchema.type) {
                        return jsonSchema.type;
                    }
                    if (jsonSchema.properties || jsonSchema.additionalProperties) {
                        return "object";
                    }
                    // ignore all remaining cases
                    return "null";
                };
                /**
                 * Creates a IControlObject with the given label referencing the given ref
                 */
                this.getControlObject = function (label, ref) {
                    return {
                        type: "Control",
                        label: label,
                        scope: {
                            $ref: ref
                        }
                    };
                };
                /**
                 * Beautifies by performing the following steps (if applicable)
                 * 1. split on uppercase letters
                 * 2. transform uppercase letters to lowercase
                 * 3. transform first letter uppercase
                 */
                this.beautify = function (text) {
                    if (text && text.length > 0) {
                        var textArray = text.split(/(?=[A-Z])/).map(function (x) { return x.toLowerCase(); });
                        textArray[0] = textArray[0].charAt(0).toUpperCase() + textArray[0].slice(1);
                        return textArray.join(' ');
                    }
                    return text;
                };
            }
            return UISchemaGenerator;
        })();
        services.UISchemaGenerator = UISchemaGenerator;
        var RecursionHelper = (function () {
            // $compile can then be used as this.$compile
            function RecursionHelper($compile) {
                var _this = this;
                this.$compile = $compile;
                this.compile = function (element, link) {
                    // Normalize the link parameter
                    if (angular.isFunction(link)) {
                        link = { post: link };
                    }
                    // Break the recursion loop by removing the contents
                    var contents = element.contents().remove();
                    var compiledContents;
                    var that = _this;
                    return {
                        pre: (link && link.pre) ? link.pre : null,
                        /**
                         * Compiles and re-adds the contents
                         */
                        post: function (scope, element) {
                            // Compile the contents
                            if (!compiledContents) {
                                compiledContents = that.$compile(contents);
                            }
                            // Re-add the compiled contents to the element
                            compiledContents(scope, function (clone) {
                                element.append(clone);
                            });
                            // Call the post-linking function, if any
                            if (link && link.post) {
                                link.post.apply(null, arguments);
                            }
                        }
                    };
                };
            }
            RecursionHelper.$inject = ["$compile"];
            return RecursionHelper;
        })();
        services.RecursionHelper = RecursionHelper;
    })(services = jsonforms.services || (jsonforms.services = {}));
})(jsonforms || (jsonforms = {}));
angular.module('jsonForms.services', [])
    .service('RecursionHelper', jsonforms.services.RecursionHelper)
    .service('ReferenceResolver', jsonforms.services.ReferenceResolver)
    .service('RenderService', jsonforms.services.RenderService)
    .service('SchemaGenerator', jsonforms.services.SchemaGenerator)
    .service('UISchemaGenerator', jsonforms.services.UISchemaGenerator);

// Source: temp/templates.js
angular.module('jsonForms').run(['$templateCache', function($templateCache) {
$templateCache.put('templates/datetime.html',
    "<div class=\"input-group\"><input type=\"text\" datepicker-popup=\"dd.MM.yyyy\" close-text=\"Close\" is-open=\"element.isOpen\" id=\"control.id\" class=\"form-control qb-control qb-control-datetime\" name=\"control.displayname\" data-jsonforms-model> <span class=\"input-group-btn\"><button type=\"button\" class=\"btn btn-default\" ng-click=\"element.openDate($event)\"><i class=\"glyphicon glyphicon-calendar\"></i></button></span></div>"
  );


  $templateCache.put('templates/element.html',
    "<recursive><div ng-if=\"element.type=='Widget'\" class=\"col-sm-{{element.size}} qb-label\">{{element.elements[0].text}}</div><div ng-if=\"element.type=='Control'\" class=\"col-sm-{{element.size}} form-group top-buffer\"><div class=\"row\"><label ng-if=\"element.label\" for=\"element.id\">{{element.label}}</label></div><div class=\"row\" style=\"padding-right: 1em\"><dynamic-widget element=\"element\"></div><div class=\"row\" style=\"padding-right: 1em\"><alert ng-repeat=\"alert in element.alerts\" type=\"{{alert.type}}\" class=\"top-buffer-s qb-alert\">{{alert.msg}}</alert></div></div><div ng-if=\"element.type=='Layout'\" class=\"col-sm-{{element.size}}\"><dynamic-widget element=\"element\"></div><!--<fieldset ng-if=\"element.type=='HorizontalLayout'\" class=\"col-sm-{{element.size}}\">--><!--<div class=\"row\">--><!--<recelement ng-repeat=\"child in element.elements\"--><!--element=\"child\"--><!--bindings=\"bindings\"--><!--top-open-date=\"topOpenDate\"--><!--top-validate-number=\"topValidateNumber\"--><!--top-validate-integer=\"topValidateInteger\">--><!--</recelement>--><!--</div>--><!--</fieldset>--><!----><!--<fieldset ng-if=\"element.type=='VerticalLayout'\" class=\"col-sm-{{element.size}}\">--><!--<recelement ng-repeat=\"child in element.elements\"--><!--element=\"child\"--><!--bindings=\"bindings\"--><!--top-open-date=\"topOpenDate\"--><!--top-validate-number=\"topValidateNumber\"--><!--top-validate-integer=\"topValidateInteger\">--><!----><!--</recelement>--><!--</fieldset>--></recursive>"
  );


  $templateCache.put('templates/form.html',
    "<div><form role=\"form\" class=\"qb-form rounded\"><recelement ng-repeat=\"child in elements\" element=\"child\" bindings=\"bindings\" top-open-date=\"openDate\" top-validate-number=\"validateNumber\" top-validate-integer=\"validateInteger\"></recelement></form></div>"
  );

}]);

},{}]},{},[1]);

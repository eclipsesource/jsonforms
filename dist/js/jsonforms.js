/*! jsonforms - v0.0.2 - 2015-09-17 Copyright (c) EclipseSource Muenchen GmbH and others. */ 
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
var JsonFormsDirectiveController = (function () {
    function JsonFormsDirectiveController(RenderService, ReferenceResolver, UISchemaGenerator, SchemaGenerator, $scope, $q) {
        this.RenderService = RenderService;
        this.ReferenceResolver = ReferenceResolver;
        this.UISchemaGenerator = UISchemaGenerator;
        this.SchemaGenerator = SchemaGenerator;
        this.$scope = $scope;
        this.$q = $q;
        var resolvedSchemaDeferred = $q.defer();
        var resolvedUISchemaDeferred = $q.defer();
        $q.all([this.fetchSchema().promise, this.fetchUiSchema().promise]).then(function (values) {
            var schema = values[0];
            var uiSchemaMaybe = values[1];
            var uiSchemaDeferred = $q.defer();
            $q.when(uiSchemaDeferred.promise).then(function (uiSchema) {
                //schema['uiSchema'] = uiSchema;
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
                dataProvider = new JSONForms.DefaultDataProvider($q, data);
            }
            RenderService.registerSchema(schema);
            $scope['elements'] = [RenderService.render(uiSchema, dataProvider)];
        });
        // TODO: check if still in use
        $scope['opened'] = false;
    }
    JsonFormsDirectiveController.prototype.fetchSchema = function () {
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
    JsonFormsDirectiveController.prototype.fetchUiSchema = function () {
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
    JsonFormsDirectiveController.prototype.fetchData = function () {
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
    JsonFormsDirectiveController.$inject = ['JSONForms.RenderService', 'ReferenceResolver', 'UISchemaGenerator', 'SchemaGenerator', '$scope', '$q'];
    return JsonFormsDirectiveController;
})();
var RecElement = (function () {
    function RecElement(recursionHelper) {
        var _this = this;
        this.recursionHelper = recursionHelper;
        this.restrict = "E";
        this.replace = true;
        this.scope = { element: '=' };
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
        scope: { control: '=' },
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
        controller: JsonFormsDirectiveController
    };
}).directive('recelement', ['RecursionHelper', function (recHelper) {
        return new RecElement(recHelper);
    }]).directive('dynamicWidget', ['$compile', '$templateRequest', function ($compile, $templateRequest) {
        var replaceJSONFormsAttributeInTemplate = function (template) {
            return template
                .replace("data-jsonforms-model", "ng-model='element.instance[element.path]'")
                .replace("data-jsonforms-validation", "ng-change='element.validate()'");
        };
        return {
            restrict: 'E',
            scope: {
                element: "="
            },
            replace: true,
            link: function (scope, element) {
                if (scope.element.templateUrl) {
                    $templateRequest(scope.element.templateUrl).then(function (template) {
                        var updatedTemplate = replaceJSONFormsAttributeInTemplate(template);
                        var compiledTemplate = $compile(updatedTemplate)(scope);
                        element.replaceWith(compiledTemplate);
                    });
                }
                else {
                    var updatedTemplate = replaceJSONFormsAttributeInTemplate(scope.element.template);
                    var template = $compile(updatedTemplate)(scope);
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
    ArrayControl.prototype.render = function (element, schema, schemaPath, dataProvider) {
        var control = this.createTableUIElement(element, dataProvider, schema, schemaPath);
        var data;
        if (dataProvider.data instanceof Array) {
            data = dataProvider.data;
        }
        else {
            data = this.refResolver.resolveInstance(dataProvider.data, this.refResolver.normalize(schemaPath));
        }
        if (data != undefined) {
            control['tableOptions'].gridOptions.data = data.slice(dataProvider.page * dataProvider.pageSize, dataProvider.page * dataProvider.pageSize + dataProvider.pageSize);
        }
        control['tableOptions'].gridOptions['paginationPage'] = dataProvider.page;
        control['tableOptions'].gridOptions['paginationPageSize'] = dataProvider.pageSize;
        control['tableOptions'].gridOptions.enableHorizontalScrollbar = 0; // TODO uiGridConstants.scrollbars.NEVER;
        control['tableOptions'].gridOptions.enableVerticalScrollbar = 0; // TODO uiGridConstants.scrollbars.NEVER;
        return {
            "label": element.label,
            "type": "Control",
            "gridOptions": control['tableOptions']['gridOptions'],
            "size": this.maxSize,
            "template": "<div ui-grid=\"element['gridOptions']\" ui-grid-auto-resize ui-grid-pagination class=\"grid\"></div>"
        };
    };
    ArrayControl.prototype.createTableUIElement = function (element, dataProvider, schema, schemaPath) {
        // TODO: how to configure paging/filtering
        var paginationEnabled = dataProvider.fetchPage !== undefined;
        var filteringEnabled = false;
        var uiElement = {
            schemaType: "array"
        };
        var that = this;
        var colDefs;
        // TODO: change semantics of the columns attribute to only show selected properties
        if (element.columns) {
            colDefs = element.columns.map(function (col, idx) {
                return {
                    field: that.refResolver.normalize(col['scope']['$ref']),
                    displayName: col.label
                };
            });
        }
        else {
            var subSchema = that.refResolver.resolveSchema(schema, schemaPath);
            var items = subSchema['items'];
            colDefs = [];
            // TODO: items
            if (items['type'] == 'object') {
                for (var prop in items['properties']) {
                    colDefs.push({
                        field: prop,
                        displayName: JSONForms.PathUtil.beautify(prop)
                    });
                }
            }
            else {
            }
        }
        var tableOptions = {
            columns: element.columns,
            gridOptions: {
                enableFiltering: filteringEnabled,
                enablePaginationControls: paginationEnabled,
                enableColumnResizing: true,
                enableAutoResize: true,
                // TODO: make cell clickable somehow
                columnDefs: colDefs,
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
        if (dataProvider.totalItems) {
            tableOptions['gridOptions']['totalItems'] = dataProvider.totalItems;
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
        tableOptions.gridOptions['onRegisterApi'] = function (gridApi) {
            //gridAPI = gridApi;
            gridApi.pagination.on.paginationChanged(that.scope, function (newPage, pageSize) {
                tableOptions.gridOptions['paginationPage'] = newPage;
                tableOptions.gridOptions['paginationPageSize'] = pageSize;
                dataProvider.setPageSize(pageSize);
                dataProvider.fetchPage(newPage, pageSize).then(function (newData) {
                    tableOptions.gridOptions.data = newData;
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
app.run(['JSONForms.RenderService', 'ReferenceResolver', '$rootScope', function (RenderService, ReferenceResolver, $rootScope) {
        RenderService.register(new ArrayControl(ReferenceResolver, $rootScope));
    }]);

// Source: js/renderers/BooleanControl.js
///<reference path="..\services.ts"/>
var BooleanControl = (function () {
    function BooleanControl() {
        this.priority = 2;
    }
    BooleanControl.prototype.render = function (element, subSchema, schemaPath, dataProvider) {
        var control = new JSONForms.ControlRenderDescription(dataProvider.data, schemaPath, element.label);
        control['template'] = "<input type=\"checkbox\" id=\"" + schemaPath + "\" class=\"jsf-control jsf-control-boolean\" ui-validate=\"'element.validate($value)'\" data-jsonforms-model/>";
        return control;
    };
    BooleanControl.prototype.isApplicable = function (uiElement, subSchema, schemaPath) {
        return uiElement.type == 'Control' && subSchema.type == 'boolean';
    };
    return BooleanControl;
})();
var app = angular.module('jsonForms.booleanControl', []);
app.run(['JSONForms.RenderService', function (RenderService) {
        RenderService.register(new BooleanControl());
    }]);

// Source: js/renderers/DatetimeControl.js
///<reference path="..\services.ts"/>
var DatetimeControl = (function () {
    function DatetimeControl() {
        this.priority = 3;
    }
    DatetimeControl.prototype.render = function (element, subSchema, schemaPath, dataProvider) {
        var control = new JSONForms.ControlRenderDescription(dataProvider.data, schemaPath, element.label);
        control['template'] =
            "<div class=\"input-group\">\n              <input type=\"text\"\n                     datepicker-popup=\"dd.MM.yyyy\"\n                     close-text=\"Close\"\n                     is-open=\"element.isOpen\"\n                     id=\"" + schemaPath + "\"\n                     class=\"form-control jsf-control jsf-control-datetime\"\n                     data-jsonforms-model/>\n                 <span class=\"input-group-btn\">\n                   <button type=\"button\" class=\"btn btn-default\" ng-click=\"element.openDate($event)\">\n                     <i class=\"glyphicon glyphicon-calendar\"></i>\n                   </button>\n                 </span>\n            </div>";
        control['isOpen'] = false;
        control['openDate'] = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            control['isOpen'] = true;
        };
        return control;
    };
    DatetimeControl.prototype.isApplicable = function (uiElement, subSchema, schemaPath) {
        return uiElement.type == 'Control' && subSchema.type == "string" &&
            subSchema['format'] != undefined && subSchema['format'] == "date-time";
    };
    return DatetimeControl;
})();
var app = angular.module('jsonForms.datetimeControl', []);
app.run(['JSONForms.RenderService', function (RenderService) {
        RenderService.register(new DatetimeControl());
    }]);

// Source: js/renderers/EnumControl.js
///<reference path="..\services.ts"/>
var EnumControl = (function () {
    function EnumControl() {
        this.priority = 3;
    }
    EnumControl.prototype.render = function (element, subSchema, schemaPath, dataProvider) {
        var enums = subSchema.enum;
        var control = new JSONForms.ControlRenderDescription(dataProvider.data, schemaPath, element.label);
        control['template'] = "<select ng-options=\"option as option for option in element.options\" id=\"" + schemaPath + "\" class=\"form-control jsf-control jsf-control-enum\" data-jsonforms-model ></select>";
        control['options'] = enums;
        return control;
    };
    EnumControl.prototype.isApplicable = function (uiElement, subSchema, schemaPath) {
        // TODO: enum are valid for any instance type, not just strings
        return uiElement.type == 'Control' && subSchema.hasOwnProperty('enum');
    };
    return EnumControl;
})();
var app = angular.module('jsonForms.enumControl', []);
app.run(['JSONForms.RenderService', function (RenderService) {
        RenderService.register(new EnumControl());
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
            var label = element.label ? element.label : "";
            var individualSize = Math.floor(maxSize / size);
            for (var j = 0; j < renderedElements.length; j++) {
                renderedElements[j].size = individualSize;
            }
            var template = label ?
                "<fieldset>\n                   <legend>" + label + "</legend>\n                   <div class=\"row\">\n                     <recelement ng-repeat=\"child in element.elements\" element=\"child\"></recelement>\n                   </div>\n                 </fieldset>" :
                "<fieldset>\n                   <div class=\"row\">\n                     <recelement ng-repeat=\"child in element.elements\" element=\"child\"></recelement>\n                   </div>\n                 </fieldset>";
            return {
                "type": "Layout",
                "elements": renderedElements,
                "size": maxSize,
                "template": template
            };
        };
    }
    HorizontalLayout.prototype.isApplicable = function (uiElement, jsonSchema, schemaPath) {
        return uiElement.type == "HorizontalLayout";
    };
    return HorizontalLayout;
})();
var app = angular.module('jsonForms.horizontalLayout', []);
app.run(['JSONForms.RenderService', function (RenderService) {
        RenderService.register(new HorizontalLayout(RenderService));
    }]);

// Source: js/renderers/IntegerControl.js
///<reference path="..\services.ts"/>
var IntegerControl = (function () {
    function IntegerControl() {
        this.priority = 2;
    }
    IntegerControl.prototype.render = function (element, subSchema, schemaPath, dataProvider) {
        var control = new JSONForms.ControlRenderDescription(dataProvider.data, schemaPath, element.label);
        control['template'] = "<input type=\"number\" step=\"1\" id=\"" + schemaPath + "\" class=\"form-control jsf-control jsf-control-integer\" data-jsonforms-validation data-jsonforms-model/>";
        return control;
    };
    IntegerControl.prototype.isApplicable = function (uiElement, subSchema, schemaPath) {
        return uiElement.type == 'Control' && subSchema.type == 'integer';
    };
    return IntegerControl;
})();
var app = angular.module('jsonForms.integerControl', []);
app.run(['JSONForms.RenderService', function (RenderService) {
        RenderService.register(new IntegerControl());
    }]);

// Source: js/renderers/NumberControl.js
///<reference path="..\services.ts"/>
var NumberControl = (function () {
    function NumberControl() {
        this.priority = 2;
    }
    NumberControl.prototype.render = function (element, schema, schemaPath, dataProvider) {
        var control = new JSONForms.ControlRenderDescription(dataProvider.data, schemaPath, element.label);
        control['template'] = "<input type=\"number\" step=\"0.01\" id=\"" + schemaPath + "\" class=\"form-control jsf-control jsf-control-number\" data-jsonforms-validation data-jsonforms-model/>";
        return control;
    };
    NumberControl.prototype.isApplicable = function (uiElement, subSchema, schemaPath) {
        return uiElement.type == 'Control' && subSchema.type == 'number';
    };
    return NumberControl;
})();
var app = angular.module('jsonForms.numberControl', []);
app.run(['JSONForms.RenderService', function (RenderService) {
        RenderService.register(new NumberControl());
    }]);

// Source: js/renderers/StringControl.js
///<reference path="..\services.ts"/>
var StringControl = (function () {
    function StringControl() {
        this.priority = 2;
    }
    StringControl.prototype.render = function (element, subSchema, schemaPath, dataProvider) {
        var control = new JSONForms.ControlRenderDescription(dataProvider.data, schemaPath, element.label);
        control['template'] = "<input type=\"text\" id=\"" + schemaPath + "\" class=\"form-control jsf-control jsf-control-string\" data-jsonforms-model data-jsonforms-validation/>";
        return control;
    };
    StringControl.prototype.isApplicable = function (uiElement, subSchema, schemaPath) {
        return uiElement.type == 'Control' && subSchema.type == 'string';
    };
    return StringControl;
})();
var app = angular.module('jsonForms.stringControl', []);
app.run(['JSONForms.RenderService', function (RenderService) {
        RenderService.register(new StringControl());
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
        var label = element.label ? element.label : "";
        var template = label ?
            "<fieldset>\n                    <legend>" + label + "</legend>\n                    <recelement ng-repeat=\"child in element.elements\" element=\"child\">\n                    </recelement>\n             </fieldset>" :
            "<fieldset>\n                    <recelement ng-repeat=\"child in element.elements\" element=\"child\">\n                    </recelement>\n            </fieldset>";
        return {
            "type": "Layout",
            "elements": renderedElements,
            "size": 99,
            "template": template
        };
    };
    VerticalLayout.prototype.isApplicable = function (uiElement, jsonSchema, schemaPath) {
        return uiElement.type == "VerticalLayout" || uiElement.type == "Group";
    };
    return VerticalLayout;
})();
var app = angular.module('jsonForms.verticalLayout', ['jsonForms.services']);
app.run(['JSONForms.RenderService', function (RenderService) {
        RenderService.register(new VerticalLayout(RenderService));
    }]);

// Source: js/renderers/label.js
/// <reference path="../../typings/angularjs/angular.d.ts"/>
/// <reference path="../services.ts"/>
var Label = (function () {
    function Label() {
        this.priority = 1;
    }
    Label.prototype.render = function (element, schema, schemaPath, dataProvider) {
        var text = element['text'];
        var size = 99;
        return {
            "type": "Widget",
            "size": size,
            "template": " <div class=\"jsf-label\">{{text}}</div>"
        };
    };
    Label.prototype.isApplicable = function (element) {
        return element.type == "Label";
    };
    return Label;
})();
var app = angular.module('jsonForms.label', ['jsonForms.services']);
app.run(['JSONForms.RenderService', function (RenderService) {
        RenderService.register(new Label());
    }]);

// Source: js/services.js
/// <reference path="../typings/angularjs/angular.d.ts"/>
/// <reference path="../typings/schemas/uischema.d.ts"/>
/// <reference path="../typings/schemas/jsonschema.d.ts"/>
var JSONForms;
(function (JSONForms) {
    var currentSchema;
    var UISchemaElement = (function () {
        function UISchemaElement(json) {
            this.json = json;
            this.type = json['type'];
            this.elements = json['elements'];
        }
        return UISchemaElement;
    })();
    JSONForms.UISchemaElement = UISchemaElement;
    var DefaultDataProvider = (function () {
        function DefaultDataProvider($q, data) {
            var _this = this;
            this.$q = $q;
            this.data = data;
            this.currentPage = 0;
            this.currentPageSize = 2;
            this.setPageSize = function (newPageSize) {
                _this.currentPageSize = newPageSize;
            };
            this.fetchPage = function (page, size) {
                _this.currentPage = page;
                _this.currentPageSize = size;
                var p = _this.$q.defer();
                if (_this.data instanceof Array) {
                    p.resolve(_this.data.slice(_this.currentPage * _this.currentPageSize, _this.currentPage * _this.currentPageSize + _this.currentPageSize));
                }
                else {
                    p.resolve(_this.data);
                }
                return p.promise;
            };
            this.totalItems = this.data.length;
            this.pageSize = this.currentPageSize;
            this.page = this.currentPage;
        }
        DefaultDataProvider.prototype.fetchData = function () {
            var p = this.$q.defer();
            // TODO: validation missing
            p.resolve(this.data);
            return p.promise;
        };
        return DefaultDataProvider;
    })();
    JSONForms.DefaultDataProvider = DefaultDataProvider;
    var ControlRenderDescription = (function () {
        function ControlRenderDescription(instance, schemaPath, label) {
            this.instance = instance;
            this.schemaPath = schemaPath;
            this.type = "Control";
            this.size = 99;
            this.alerts = []; // TODO IAlert type missing
            this.path = PathUtil.normalize(schemaPath);
            var l;
            if (label) {
                l = label;
            }
            else {
                l = PathUtil.beautifiedLastFragment(schemaPath);
            }
            this.label = l;
        }
        ControlRenderDescription.prototype.validate = function () {
            if (tv4 == undefined) {
                return true;
            }
            var normalizedPath = '/' + PathUtil.normalize(this.schemaPath);
            var results = tv4.validateMultiple(this.instance, currentSchema);
            var errorMsg = undefined;
            for (var i = 0; i < results['errors'].length; i++) {
                var validationResult = results['errors'][i];
                if (validationResult.schemaPath.indexOf('/required') != -1) {
                    var propName = validationResult['params']['key'];
                    if (propName == normalizedPath.substr(normalizedPath.lastIndexOf('/') + 1, normalizedPath.length)) {
                        errorMsg = "Missing property";
                        break;
                    }
                }
                if (validationResult['dataPath'] == normalizedPath) {
                    errorMsg = validationResult.message;
                    break;
                }
            }
            if (errorMsg == undefined) {
                // TODO: perform required check
                this.alerts = [];
                return true;
            }
            this.alerts = [];
            var alert = {
                type: 'danger',
                msg: errorMsg
            };
            this.alerts.push(alert);
            return false;
        };
        return ControlRenderDescription;
    })();
    JSONForms.ControlRenderDescription = ControlRenderDescription;
    // TODO: EXPORT
    var RenderService = (function () {
        function RenderService(refResolver) {
            var _this = this;
            this.refResolver = refResolver;
            this.renderers = [];
            this.render = function (element, dataProvider) {
                var foundRenderer;
                var schemaPath;
                var subSchema;
                // TODO element must be IControl
                if (element['scope']) {
                    schemaPath = element['scope']['$ref'];
                    subSchema = _this.refResolver.resolveSchema(currentSchema, schemaPath);
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
                var resultObject = foundRenderer.render(element, currentSchema, schemaPath, dataProvider);
                if (resultObject.validate) {
                    resultObject.validate();
                }
                return resultObject;
            };
            this.register = function (renderer) {
                _this.renderers.push(renderer);
            };
        }
        RenderService.prototype.registerSchema = function (schema) {
            currentSchema = schema;
        };
        RenderService.$inject = ['ReferenceResolver'];
        return RenderService;
    })();
    JSONForms.RenderService = RenderService;
    var PathUtil = (function () {
        function PathUtil() {
        }
        PathUtil.beautifiedLastFragment = function (schemaPath) {
            return PathUtil.beautify(PathUtil.capitalizeFirstLetter(schemaPath.substr(schemaPath.lastIndexOf('/') + 1, schemaPath.length)));
        };
        PathUtil.capitalizeFirstLetter = function (string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        };
        PathUtil.Keywords = ["items", "properties", "#"];
        PathUtil.normalize = function (path) {
            return PathUtil.filterNonKeywords(PathUtil.toPropertyFragments(path)).join("/");
        };
        PathUtil.toPropertyFragments = function (path) {
            return path.split('/').filter(function (fragment) {
                return fragment.length > 0;
            });
        };
        PathUtil.filterNonKeywords = function (fragments) {
            return fragments.filter(function (fragment) {
                return !(PathUtil.Keywords.indexOf(fragment) !== -1);
            });
        };
        /**
         * Beautifies by performing the following steps (if applicable)
         * 1. split on uppercase letters
         * 2. transform uppercase letters to lowercase
         * 3. transform first letter uppercase
         */
        PathUtil.beautify = function (text) {
            if (text && text.length > 0) {
                var textArray = text.split(/(?=[A-Z])/).map(function (x) { return x.toLowerCase(); });
                textArray[0] = textArray[0].charAt(0).toUpperCase() + textArray[0].slice(1);
                return textArray.join(' ');
            }
            return text;
        };
        return PathUtil;
    })();
    JSONForms.PathUtil = PathUtil;
    var ReferenceResolver = (function () {
        // $compile can then be used as this.$compile
        function ReferenceResolver($compile) {
            var _this = this;
            this.$compile = $compile;
            this.pathMapping = {};
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
                return PathUtil.normalize(path);
            };
            this.resolveUi = function (instance, uiPath) {
                var p = uiPath + "/scope/$ref";
                if (_this.pathMapping !== undefined && _this.pathMapping.hasOwnProperty(p)) {
                    p = _this.pathMapping[p];
                }
                return _this.resolveInstance(instance, p);
            };
            this.resolveInstance = function (instance, path) {
                var fragments = PathUtil.toPropertyFragments(_this.normalize(path));
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
                var fragments = PathUtil.toPropertyFragments(path);
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
        }
        ReferenceResolver.$inject = ["$compile"];
        return ReferenceResolver;
    })();
    JSONForms.ReferenceResolver = ReferenceResolver;
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
    JSONForms.SchemaGenerator = SchemaGenerator;
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
                                text: PathUtil.beautify(schemaName)
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
                        var controlObject = _this.getControlObject(PathUtil.beautify(schemaName), currentRef);
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
        }
        return UISchemaGenerator;
    })();
    JSONForms.UISchemaGenerator = UISchemaGenerator;
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
    JSONForms.RecursionHelper = RecursionHelper;
    var RenderDescriptionFactory = (function () {
        function RenderDescriptionFactory() {
        }
        RenderDescriptionFactory.prototype.createControlDescription = function (data, schemaPath, label) {
            return new ControlRenderDescription(data, schemaPath, label);
        };
        return RenderDescriptionFactory;
    })();
    JSONForms.RenderDescriptionFactory = RenderDescriptionFactory;
})(JSONForms || (JSONForms = {}));
angular.module('jsonForms.services', [])
    .service('RecursionHelper', JSONForms.RecursionHelper)
    .service('ReferenceResolver', JSONForms.ReferenceResolver)
    .service('JSONForms.RenderService', JSONForms.RenderService)
    .service('SchemaGenerator', JSONForms.SchemaGenerator)
    .service('UISchemaGenerator', JSONForms.UISchemaGenerator)
    .service('JSONForms.RenderDescriptionFactory', JSONForms.RenderDescriptionFactory);

// Source: temp/templates.js
angular.module('jsonForms').run(['$templateCache', function($templateCache) {
$templateCache.put('templates/element.html',
    "<recursive><div ng-if=\"element.type=='Widget'\" class=\"col-sm-{{element.size}} jsf-label\">{{element.elements[0].text}}</div><div ng-if=\"element.type=='Control'\" class=\"col-sm-{{element.size}} form-group top-buffer\"><div class=\"row\"><label ng-if=\"element.label\" for=\"element.id\">{{element.label}}</label></div><div class=\"row\" style=\"padding-right: 1em\"><dynamic-widget element=\"element\"></div><div class=\"row\" style=\"padding-right: 1em\"><alert ng-repeat=\"alert in element.alerts\" type=\"{{alert.type}}\" class=\"top-buffer-s jsf-alert\">{{alert.msg}}</alert></div></div><div ng-if=\"element.type=='Layout'\" class=\"col-sm-{{element.size}}\"><dynamic-widget element=\"element\"></div></recursive>"
  );


  $templateCache.put('templates/form.html',
    "<div><form role=\"form\" class=\"jsf-form rounded\"><recelement ng-repeat=\"child in elements\" element=\"child\" bindings=\"bindings\" top-open-date=\"openDate\" top-validate-number=\"validateNumber\" top-validate-integer=\"validateInteger\"></recelement></form></div>"
  );

}]);

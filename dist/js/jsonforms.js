/// <reference path="../typings/angularjs/angular.d.ts"/>
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
        // TODO: EXPORT
        var RenderService = (function () {
            // $compile can then be used as this.$compile
            function RenderService($compile) {
                var _this = this;
                this.$compile = $compile;
                this.renderers = [];
                this.render = function (element, schema, instance, path, dataProvider) {
                    var foundRenderer;
                    for (var i = 0; i < _this.renderers.length; i++) {
                        if (_this.renderers[i].isApplicable(element)) {
                            if (foundRenderer == undefined || _this.renderers[i].priority > foundRenderer.priority) {
                                foundRenderer = _this.renderers[i];
                            }
                        }
                    }
                    if (foundRenderer === undefined) {
                        throw new Error("No applicable renderer found for element " + JSON.stringify(element));
                    }
                    return foundRenderer.render(element, schema, instance, path, dataProvider);
                };
                this.register = function (renderer) {
                    _this.renderers.push(renderer);
                };
            }
            RenderService.$inject = ["$compile"];
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
                this.addToMapping = function (addition) {
                    for (var ref in addition) {
                        if (addition.hasOwnProperty(ref)) {
                            _this.pathMapping[ref] = addition[ref];
                        }
                    }
                };
                this.get = function (uiSchemaPath) {
                    return _this.pathMapping[uiSchemaPath + "/scope/$ref"];
                };
                this.normalize = function (path) {
                    return _this.filterNonKeywords(_this.toPropertyFragments(path)).join("/");
                };
                this.resolve = function (instance, path) {
                    var p = path + "/scope/$ref";
                    if (_this.pathMapping !== undefined && _this.pathMapping.hasOwnProperty(p)) {
                        p = _this.pathMapping[p];
                    }
                    return _this.resolveModelPath(instance, p);
                };
                this.resolveModelPath = function (instance, path) {
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
    .service('RenderService', jsonforms.services.RenderService);
/// <reference path="../../typings/angularjs/angular.d.ts"/>
/// <reference path="../services.ts"/>
var ControlRenderer = (function () {
    function ControlRenderer(refResolver) {
        this.refResolver = refResolver;
        this.priority = 1;
    }
    ControlRenderer.prototype.render = function (element, schema, instance, path, dataProvider) {
        var control = {};
        control["schemaType"] = element['scope']['type'];
        control["bindings"] = instance;
        control["path"] = this.refResolver.normalize(this.refResolver.get(path));
        control["label"] = element['label'];
        // TODO: create unique ID?
        control["id"] = path;
        return {
            "type": "Control",
            "elements": [control],
            "size": 99 // TODO
        };
    };
    ControlRenderer.prototype.isApplicable = function (element) {
        return element.type == "Control";
    };
    return ControlRenderer;
})();
var app = angular.module('jsonForms.control', []);
app.run(['RenderService', 'ReferenceResolver', function (RenderService, ReferenceResolver) {
        RenderService.register(new ControlRenderer((ReferenceResolver)));
    }]);
/// <reference path="../../typings/angularjs/angular.d.ts"/>
/// <reference path="../services.ts"/>
var HorizontalLayoutRenderer = (function () {
    function HorizontalLayoutRenderer(renderServ) {
        var _this = this;
        this.renderServ = renderServ;
        this.priority = 1;
        this.render = function (element, schema, instance, path, dataProvider) {
            var that = _this;
            var renderElements = function (elements) {
                if (elements === undefined || elements.length == 0) {
                    return [];
                }
                else {
                    var basePath = path + "/elements/";
                    return elements.reduce(function (acc, curr, idx, els) {
                        acc.push(that.renderServ.render(curr, schema, instance, basePath + idx, dataProvider));
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
                "type": "HorizontalLayout",
                "elements": renderedElements,
                "size": maxSize
            };
        };
    }
    HorizontalLayoutRenderer.prototype.isApplicable = function (element) {
        return element.type == "HorizontalLayout";
    };
    return HorizontalLayoutRenderer;
})();
var app = angular.module('jsonForms.horizontalLayout', []);
app.run(['RenderService', function (RenderService) {
        RenderService.register(new HorizontalLayoutRenderer(RenderService));
    }]);
/// <reference path="../../typings/angularjs/angular.d.ts"/>
/// <reference path="../services.ts"/>
var LabelRenderer = (function () {
    function LabelRenderer() {
        this.priority = 1;
    }
    LabelRenderer.prototype.render = function (element, schema, instance, path, dataProvider) {
        var label = {};
        label["text"] = element['text'];
        return {
            "type": "Label",
            "elements": [label],
            // TODO
            "size": 99
        };
    };
    LabelRenderer.prototype.isApplicable = function (element) {
        return element.type == "Label";
    };
    return LabelRenderer;
})();
var app = angular.module('jsonForms.label', ['jsonForms.services']);
app.run(['RenderService', function (RenderService) {
        RenderService.register(new LabelRenderer());
    }]);
/// <reference path="../../typings/angularjs/angular.d.ts"/>
/// <reference path="../services.ts"/>
var TableRenderer = (function () {
    function TableRenderer(refResolver, scope) {
        this.refResolver = refResolver;
        this.scope = scope;
        this.maxSize = 99;
        this.priority = 2;
    }
    TableRenderer.prototype.isApplicable = function (element) {
        return element['type'] == 'Control' && element['scope']['type'] == 'array';
    };
    TableRenderer.prototype.render = function (resolvedElement, schema, instanceData, path, dataProvider) {
        var control = this.createTableUIElement(resolvedElement, schema, instanceData, path, dataProvider);
        control['tableOptions'].gridOptions.data = instanceData;
        control["schemaType"] = "array";
        control["label"] = resolvedElement['label'];
        if (dataProvider === undefined) {
            control["bindings"] = instanceData;
        }
        else {
            control['tableOptions'].gridOptions.data = this.resolveColumnData(path, instanceData);
        }
        return {
            "type": "Control",
            "elements": [control],
            "size": this.maxSize
        };
    };
    TableRenderer.prototype.resolveColumnData = function (uiPath, data) {
        if (data instanceof Array) {
            return data;
        }
        else {
            // relative scope
            return this.refResolver.resolve(data, uiPath);
        }
    };
    TableRenderer.prototype.createTableUIElement = function (element, schema, instanceData, path, dataProvider) {
        if (dataProvider === undefined) {
            dataProvider = {};
        }
        // TODO: how to configure paging/filtering
        var paginationEnabled = dataProvider.fetchPage !== undefined;
        var filteringEnabled = false;
        var uiElement = {
            schemaType: "array"
        };
        var parentScope = this.refResolver.get(path);
        var that = this;
        var prefix = this.refResolver.normalize(parentScope);
        var colDefs = element.columns.map(function (col, idx) {
            return {
                field: that.refResolver.normalize(that.refResolver.get(path + "/columns/" + idx)).replace(prefix + "/", ''),
                displayName: col.label
            };
        });
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
        uiElement['fetchPagedData'] = function (path) {
            tableOptions.gridOptions.data = this.refResolver.resolve(instanceData, path);
        };
        uiElement['fetchFilteredData'] = function (searchTerms) {
            //var url = EndpointMapping.map(typeName).filter(searchTerms);
            //$http.get(url).success(function (data) {
            //    tableOptions.gridOptions.data = data;
            //});
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
                    tableOptions.gridOptions.data = this.resolveColumnData(path, newData, colDefs);
                });
            });
        };
        uiElement['tableOptions'] = tableOptions;
        return uiElement;
    };
    TableRenderer.prototype.findSearchTerms = function (grid) {
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
    return TableRenderer;
})();
var app = angular.module('jsonForms.table', []);
app.run(['RenderService', 'ReferenceResolver', '$rootScope', function (RenderService, ReferenceResolver, $rootScope) {
        RenderService.register(new TableRenderer(ReferenceResolver, $rootScope));
    }]);
/// <reference path="../../typings/angularjs/angular.d.ts"/>
/// <reference path="../services.ts"/>
var VerticalLayoutRenderer = (function () {
    function VerticalLayoutRenderer(renderService) {
        this.renderService = renderService;
        this.priority = 1;
    }
    VerticalLayoutRenderer.prototype.render = function (element, schema, instance, path, dataProvider) {
        var that = this;
        var renderElements = function (elements) {
            if (elements === undefined || elements.length == 0) {
                return [];
            }
            else {
                var basePath = path + "/elements/";
                return elements.reduce(function (acc, curr, idx, els) {
                    acc.push(that.renderService.render(curr, schema, instance, basePath + idx, dataProvider));
                    return acc;
                }, []);
            }
        };
        var renderedElements = renderElements(element.elements);
        return {
            "type": "VerticalLayout",
            "elements": renderedElements,
            "size": 99
        };
    };
    VerticalLayoutRenderer.prototype.isApplicable = function (element) {
        return element.type == "VerticalLayout";
    };
    return VerticalLayoutRenderer;
})();
var app = angular.module('jsonForms.verticalLayout', ['jsonForms.services']);
app.run(['RenderService', function (RenderService) {
        RenderService.register(new VerticalLayoutRenderer(RenderService));
    }]);
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
    'jsonForms.control',
    'jsonForms.verticalLayout',
    'jsonForms.horizontalLayout',
    'jsonForms.table'
]);
/// <reference path="../typings/angularjs/angular.d.ts"/>
/// <reference path="./services.ts"/>
var jsonFormsDirectives = angular.module('jsonForms.directives', ['jsonForms.services']);
var JsonFormsDiretiveController = (function () {
    function JsonFormsDiretiveController(RenderService, ReferenceResolver, $scope, $q) {
        this.RenderService = RenderService;
        this.ReferenceResolver = ReferenceResolver;
        this.$scope = $scope;
        this.$q = $q;
        $q.all([this.fetchSchema().promise, this.fetchUiSchema().promise, this.fetchData()]).then(function (values) {
            var schema = values[0];
            var uiSchema = values[1];
            var data = values[2];
            console.log("data is " + JSON.stringify(data));
            schema['uiSchema'] = uiSchema;
            ReferenceResolver.addToMapping(JsonRefs.findRefs(uiSchema));
            JsonRefs.resolveRefs(schema, {}, function (err, resolvedSchema, meta) {
                var ui = resolvedSchema["uiSchema"];
                $scope['elements'] = [RenderService.render(ui, schema, data, "#", $scope.asyncDataProvider)];
            });
        });
        // TODO
        $scope['opened'] = false;
        $scope['openDate'] = function ($event, element) {
            $event.preventDefault();
            $event.stopPropagation();
            element.isOpen = true;
        };
        $scope['validateNumber'] = function (value, element) {
            if (value !== undefined && value !== null && isNaN(value)) {
                element.alerts = [];
                var alert = {
                    type: 'danger',
                    msg: 'Must be a valid number!'
                };
                element.alerts.push(alert);
                return false;
            }
            element.alerts = [];
            return true;
        };
        $scope['validateInteger'] = function (value, element) {
            if (value !== undefined && value !== null && (isNaN(value) || (value !== "" && !(/^\d+$/.test(value))))) {
                element.alerts = [];
                var alert = {
                    type: 'danger',
                    msg: 'Must be a valid integer!'
                };
                element.alerts.push(alert);
                return false;
            }
            element.alerts = [];
            return true;
        };
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
        throw new Error("Either the 'ui-schema' or the 'async-ui-schema' attribute must be specified.");
    };
    JsonFormsDiretiveController.prototype.fetchData = function () {
        var dataProvider = this.$scope.asyncDataProvider;
        var data = this.$scope.data;
        if (dataProvider && data) {
            throw new Error("You cannot specify both the 'data' and the 'async-data-provider' attribute at the same time.");
        }
        else if (dataProvider) {
            var prom = dataProvider.fetchData();
            return prom.$promise;
        }
        else if (this.$scope.data) {
            var p = this.$q.defer();
            p.resolve(this.$scope.data);
            return p.promise;
        }
        throw new Error("Either the 'data' or the 'async-data-provider' attribute must be specified.");
    };
    JsonFormsDiretiveController.$inject = ['RenderService', 'ReferenceResolver', '$scope', '$q'];
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
    }]);
//# sourceMappingURL=jsonforms.js.map
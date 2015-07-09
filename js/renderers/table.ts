/// <reference path="../../typings/angularjs/angular.d.ts"/>
/// <reference path="../services.ts"/>

class TableRenderer implements jsonforms.services.IRenderer {


    private maxSize = 99;

    priority = 2;

    constructor(private refResolver: jsonforms.services.IReferenceResolver, private scope: ng.IScope) {

    }

    isApplicable(element:jsonforms.services.UISchemaElement):boolean {
        return element['type'] == 'Control' && element['scope']['type'] == 'array';
    }

    render(resolvedElement: jsonforms.services.UISchemaElement, schema, instanceData, path: string, dataProvider) {

        var control = this.createTableUIElement(resolvedElement, schema, instanceData, path, dataProvider);

        control['tableOptions'].gridOptions.data = instanceData;
        control["schemaType"] = "array";
        control["label"] = resolvedElement['label'];

        if (dataProvider === undefined) {
            control["bindings"] = instanceData;
        } else {
            control['tableOptions'].gridOptions.data = this.resolveColumnData(path, instanceData);
        }

        return {
            "type": "Control",
            "elements": [control],
            "size": this.maxSize
        };
    }

    private resolveColumnData(uiPath, data) {
        if (data instanceof Array) {
            return data;
        } else {
            // relative scope
            return this.refResolver.resolve(data, uiPath);
        }
    }

    private createTableUIElement(element, schema, instanceData, path, dataProvider) {

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
        var colDefs = element.columns.map(function(col, idx) {
            return {
                field:  that.refResolver.normalize(that.refResolver.get(path + "/columns/" + idx)).replace(prefix + "/", ''),
                displayName: col.label
            }
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
            tableOptions['gridOptions']['paginationPageSizes'] = [1,2,3,4,5];
            tableOptions['gridOptions']['paginationPageSize'] = 1;
            tableOptions['gridOptions']['paginationPage'] = 1;
        }

        // TODO:
        //var firstColumnDef = tableOptions.gridOptions.columnDefs[0];
        //firstColumnDef.cellTemplate = firstColumnDef.cellTemplate.replace("<<TYPE>>", path);

        // convenience methods --
        uiElement['enablePaginationControls'] = function() {
            tableOptions.gridOptions.enablePaginationControls = true;
        };
        uiElement['disablePaginationControls'] = function() {
            tableOptions.gridOptions.enablePaginationControls = false;
        };
        uiElement['fetchPagedData'] = function(path) {
            tableOptions.gridOptions.data = this.refResolver.resolve(instanceData, path);
        };
        uiElement['fetchFilteredData'] = function(searchTerms) {
            //var url = EndpointMapping.map(typeName).filter(searchTerms);
            //$http.get(url).success(function (data) {
            //    tableOptions.gridOptions.data = data;
            //});
        };
        uiElement['setTotalItems'] = function() {
            // TODO: determine total items
        };

        tableOptions.gridOptions['onRegisterApi'] = function(gridApi) {
            //gridAPI = gridApi;
            gridApi.pagination.on.paginationChanged(that.scope, function (newPage, pageSize) {
                tableOptions.gridOptions['paginationPage'] = newPage;
                tableOptions.gridOptions['paginationPageSize'] = pageSize;
                dataProvider.setPageSize(pageSize);
                dataProvider.fetchPage(newPage, pageSize).$promise.then(function(newData, headers) {
                    tableOptions.gridOptions.data = this.resolveColumnData(path, newData, colDefs);
                });
            });
        } ;
        uiElement['tableOptions'] = tableOptions;

        return uiElement;
    }

    findSearchTerms(grid) {
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
    }
}

var app = angular.module('jsonForms.table', []);

app.run(['RenderService', 'ReferenceResolver', '$rootScope', function(RenderService, ReferenceResolver, $rootScope) {
    RenderService.register(new TableRenderer(ReferenceResolver, $rootScope));
}]);
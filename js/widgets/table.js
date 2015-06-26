
var app = angular.module('jsonForms.table', []);

app.run(['RenderService', 'BindingService', 'ReferenceResolver', '$rootScope', function(RenderService, BindingService, ReferenceResolver, $rootScope) {

    var gridAPI;

    function createTableUIElement(element, schema, instanceData, path, dataProvider) {

        if (dataProvider === undefined) {
            dataProvider = {};
        }

        // TODO: how to configure paging/filtering
        var paginationEnabled = dataProvider.fetchPage !== undefined;
        var filteringEnabled = false;

        // TODO: what are the exact requirements for our UI element?
        //var uiElement = RenderService.createUiElement(element.displayname, element.scope.path, {type: "array" }, instanceData);

        var uiElement = {
            schemaType: "array"
        };

        var parentScope = ReferenceResolver.get(path);

        var prefix = ReferenceResolver.normalize(parentScope);
        var colDefs = element.columns.map(function(col, idx) {
            return {
                field:  ReferenceResolver.normalize(ReferenceResolver.get(path + "/columns/" + idx)).replace(prefix + "/", ''),
                displayName: col.label
            }
        });

        console.log("cols are " + JSON.stringify(colDefs));

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
            tableOptions.gridOptions.enablePagination = paginationEnabled;
            tableOptions.gridOptions.useExternalPagination = true;
            // TODO: dummies
            tableOptions.gridOptions.paginationPageSizes = [1,2,3,4,5];
            tableOptions.gridOptions.paginationPageSize = 1;
            tableOptions.gridOptions.paginationPage = 1;
        }

        // TODO:
        //var firstColumnDef = tableOptions.gridOptions.columnDefs[0];
        //firstColumnDef.cellTemplate = firstColumnDef.cellTemplate.replace("<<TYPE>>", path);

        // convenience methods --
        uiElement.enablePaginationControls = function() {
            tableOptions.gridOptions.enablePaginationControls = true;
        };
        uiElement.disablePaginationControls = function() {
            tableOptions.gridOptions.enablePaginationControls = false;
        };
        uiElement.fetchPagedData = function(path) {
            var data = ReferenceResolver.resolve(instanceData, path);
            tableOptions.gridOptions.data = data;
        };
        uiElement.fetchFilteredData = function(searchTerms) {
            //var url = EndpointMapping.map(typeName).filter(searchTerms);
            //$http.get(url).success(function (data) {
            //    tableOptions.gridOptions.data = data;
            //});
        };
        uiElement.setTotalItems = function() {
            // TODO: determine total items
        };

        tableOptions.gridOptions.onRegisterApi = function(gridApi) {
            gridAPI = gridApi;
            gridApi.pagination.on.paginationChanged($rootScope, function (newPage, pageSize) {
                tableOptions.gridOptions.paginationPage = newPage;
                tableOptions.gridOptions.paginationPageSize = pageSize;
                dataProvider.setPageSize(pageSize);
                dataProvider.fetchPage(newPage, pageSize).$promise.then(function(newData, headers) {
                    var resolvedData = resolveColumnData(path, newData, colDefs);
                    tableOptions.gridOptions.data = resolvedData;
                });
            });
        } ;
        uiElement.tableOptions = tableOptions;

        return uiElement;
    }

    function resolveColumnData(uiPath, data) {
        if (data instanceof Array) {
            return data;
        } else {
            // relative scope
            return ReferenceResolver.resolve(data, uiPath);
        }
    }

    var findSearchTerms = function(grid) {
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

    RenderService.register({
        id: "Table",
        // TODO: we completly ignore the schema here
        render: function (resolvedElement, schema, instanceData, path, dataProvider) {

            var control = createTableUIElement(resolvedElement, schema, instanceData, path, dataProvider);

            control.tableOptions.gridOptions.data = instanceData;
            control["schemaType"] = "array";
            control["label"] = resolvedElement.label;

            if (dataProvider === undefined) {
                control["bindings"] = control.tableOptions.gridOptions.data;
            } else {
                control.tableOptions.gridOptions.data = resolveColumnData(path, instanceData, control.tableOptions.gridOptions.columnDefs);
            }

            return {
                    "type": "Control",
                    "elements": [control],
                    "size": maxSize
            };
        }
    });
}]);
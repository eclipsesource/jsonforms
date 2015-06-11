
var app = angular.module('jsonForms.table', []);

app.run(['RenderService', 'BindingService', 'EndpointMapping', '$http', '$q', '$location', function(RenderService, BindingService, EndpointMapping, $http) {

    function createTableUIElement(element, instanceData) {

        // TODO: how to configure paging/filtering
        var paginationEnabled = true;
        var filteringEnabled = true;

        // TODO: what are the exact requirements for our UI element?
        //var uiElement = RenderService.createUiElement(element.displayname, element.scope.path, {type: "array" }, instanceData);

        //var uiElement = {
        //    displayname: displayName,
        //    id: path,
        //    value: value,
        //    type: type.type,
        //    options: type.enum,
        //    isOpen: false,
        //    alerts: []
        //};
        var uiElement = {
            type: "array"
        };

        var tableOptions = {
            columns: element.columns,
            gridOptions: {
                enableFiltering: filteringEnabled,
                enablePaginationControls: paginationEnabled,
                enableColumnResizing: true,
                enableAutoResize: true,
                // TODO: make cell clickable somehow
                columnDefs: [
                    //{
                //    field: element.idLabel.toLowerCase(),
                //    cellTemplate: '<a href="#/<<TYPE>>/{{row.entity.id}}">{{row.entity[col.field]}}</a>'
                //}
                 ],
                data: [],
                useExternalFiltering: true
            }
        };

        if (paginationEnabled) {
            tableOptions.gridOptions.enablePagination = paginationEnabled;
            tableOptions.gridOptions.useExternalPagination = true;
            // TODO: dummys
            tableOptions.gridOptions.paginationPageSizes = [5,10];
            tableOptions.gridOptions.paginationPageSize = 5;
            tableOptions.gridOptions.paginationPage = 1;
        }


        // push all columns defined in the view model
        for (var j = 0; j < element.columns.length; j++) {
            //if (element.idLabel.toLowerCase() !== element.columns[j].scope.path){
                tableOptions.gridOptions.columnDefs.push({
                    field: element.columns[j].scope.path
                });
            //}
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
        uiElement.fetchPagedData = function() {

            var hasScope = element.scope !== undefined;

            var data;
            if (hasScope) {
                var path = element.scope.path;
                data = instanceData[0][path];
            } else {
                data = instanceData;
            }

            tableOptions.gridOptions.data = data;

        };
        uiElement.fetchFilteredData = function(searchTerms) {
            var url = EndpointMapping.map(typeName).filter(searchTerms);
            $http.get(url).success(function (data) {
                tableOptions.gridOptions.data = data;
            });

        };
        uiElement.setTotalItems = function() {
            // TODO: determine total items
        };
        uiElement.registerCallbacks = function($scope) {
            var that = this;
            tableOptions.gridOptions.onRegisterApi = function (gridApi) {
                gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
                    tableOptions.gridOptions.paginationPage = newPage;
                    tableOptions.gridOptions.paginationPageSize = pageSize;
                    that.fetchPagedData();
                });
                gridApi.core.on.filterChanged($scope, function () {
                    var grid = this.grid;
                    var searchTerms = findSearchTerms(grid);
                    if (searchTerms.length > 0) {
                        that.fetchFilteredData(searchTerms);
                        that.disablePaginationControls();
                    } else {
                        that.fetchPagedData();
                        that.enablePaginationControls();
                    }
                });

            }
        };

        uiElement.tableOptions = tableOptions;

        return uiElement;
    }

    function createTableControlObject() {
        return {
            "type": "Control",
            "elements": [],
            "size": maxSize
        };
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
        render: function (element, schema, instanceData, $scope) {
            var tObject = createTableControlObject();

            if (schema.type == "array") {

                var tableUiElement = createTableUIElement(element, instanceData);

                tableUiElement.registerCallbacks($scope);
                tableUiElement.fetchPagedData();

                tObject.elements.push(tableUiElement);
                BindingService.add(tableUiElement.id, tableUiElement.value);
                return tObject;
            } else {
                // TODO: rather throw exception
                console.log("WARNING: " + element.feature.path + " has not expected type array.")
            }

        }
    });
}]);

var app = angular.module('jsonForms.table', []);

app.run(['RenderService', 'BindingService', 'EndpointMapping', 'DataCommon', '$http', '$q', '$location', function(RenderService, BindingService, EndpointMapping, DataCommon, $http, $q, $location) {

    function createTableUIElement(element, typeName, instanceData, schema) {

        var paginationEnabled = EndpointMapping.map(typeName).isPaginationEnabled();
        var filteringEnabled = EndpointMapping.map(typeName).isFilteringEnabled();

        var uiElement = RenderService.createUiElement(element.displayname, element.feature.path, {type: "array" }, instanceData);
        var tableOptions = {
            columns: element.columns,
            gridOptions: {
                enableFiltering: filteringEnabled,
                enablePaginationControls: paginationEnabled,
                enableColumnResizing: true,
                enableAutoResize: true,
                columnDefs: [{
                    field: element.idLabel.toLowerCase(),
                    cellTemplate: '<a href="#/<<TYPE>>{{row.entity.id}}">{{row.entity[col.field]}}</a>'
                }],
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
            if (element.idLabel.toLowerCase() !== element.columns[j].feature.path){
                tableOptions.gridOptions.columnDefs.push({
                    field: element.columns[j].feature.path
                });
            }
        }

        var firstColumnDef = tableOptions.gridOptions.columnDefs[0];
        firstColumnDef.cellTemplate = firstColumnDef.cellTemplate.replace("<<TYPE>>", EndpointMapping.map(typeName).single);

        // convenience methods --
        uiElement.enablePaginationControls = function() {
            tableOptions.gridOptions.enablePaginationControls = true;
        };
        uiElement.disablePaginationControls = function() {
            tableOptions.gridOptions.enablePaginationControls = false;
        };
        uiElement.fetchPagedData = function() {
            console.log("INFO: within fetchPagedData");
            var that = this;

            var currentPage = tableOptions.gridOptions.paginationPage;
            var pageSize = tableOptions.gridOptions.paginationPageSize;

            if (currentPage === undefined) {
                currentPage = EndpointMapping.map(typeName).pagination.defaultPage;
            }
            if (pageSize === undefined) {
                pageSize = EndpointMapping.map(typeName).pagination.defaultPageSize;
            }

            var u = EndpointMapping.map(typeName).page(currentPage, pageSize);
            // TODO: relies on url
            var segments = $location.absUrl().split("/");
            var hostId = segments[segments.length - 1];

            u = u.replace("{{id}}", hostId);

            $http.get(u).success(function (newData) {
                console.log("INFO: fetched data from " + u + " of size " + newData.length);
                console.log("INFO: fetch data is " + JSON.stringify(newData));
                tableOptions.gridOptions.data = newData;
                that.setTotalItems();
            });
        };
        uiElement.fetchFilteredData = function(searchTerms) {
            var url = EndpointMapping.map(typeName).filter(searchTerms);
            console.log("INFO: search terms are " + JSON.stringify(searchTerms));
            console.log("INFO: filter URL is " + url);
            $http.get(url).success(function (data) {
                tableOptions.gridOptions.data = data;
            });

        };
        uiElement.setTotalItems = function() {
            var url = EndpointMapping.map(typeName).count();
            $http.get(url).success(function (objs) {
                console.log("INFO: totalItems are " + JSON.stringify(objs.length));
                tableOptions.gridOptions.totalItems = objs.size;
            });
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

    // type is a domain type, not an UI type
    function createTypeTableUIElement(element, typeName) {

        var paginationEnabled = EndpointMapping.map(typeName).isPaginationEnabled();
        var filteringEnabled = EndpointMapping.map(typeName).isFilteringEnabled();

        var uiElement = RenderService.createUiElement(element.displayname, element.scope.type, {type: "array"}, element.value);
        var tableOptions = {
            columns: element.columns,
            gridOptions: {
                enableFiltering: filteringEnabled,
                enablePaginationControls: paginationEnabled,
                enableColumnResizing: true,
                enableAutoResize: true,
                columnDefs: [{
                    field: element.idLabel.toLowerCase(),
                    cellTemplate: '<a href="#/<<TYPE>>/{{row.entity.id}}">{{row.entity[col.field]}}</a>'
                }],
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
            if (element.idLabel.toLowerCase() !== element.columns[j].feature.path){
                tableOptions.gridOptions.columnDefs.push({
                    field: element.columns[j].feature.path
                });
            }
        }

        var firstColumnDef = tableOptions.gridOptions.columnDefs[0];
        console.log("INFO: mapped type " + JSON.stringify(EndpointMapping.map(typeName)));
        firstColumnDef.cellTemplate = firstColumnDef.cellTemplate.replace("<<TYPE>>", EndpointMapping.map(typeName).many);

        // convenience methods --
        uiElement.enablePaginationControls = function() {
            tableOptions.gridOptions.enablePaginationControls = true;
        };
        uiElement.disablePaginationControls = function() {
            tableOptions.gridOptions.enablePaginationControls = false;
        };
        uiElement.fetchPagedData = function() {
            console.log("INFO: within fetchPagedData");
            var that = this;

            var currentPage = tableOptions.gridOptions.paginationPage;
            var pageSize = tableOptions.gridOptions.paginationPageSize;

            var url = EndpointMapping.map(typeName).page(currentPage, pageSize);
            $http.get(url).success(function (newData) {
                console.log("INFO: fetched data from " + url + " of size " + newData.length);
                console.log("INFO: fetch data is " + JSON.stringify(newData));
                tableOptions.gridOptions.data = newData;
                that.setTotalItems();
            });
        };
        uiElement.fetchFilteredData = function(searchTerms) {
            var url = EndpointMapping.map(typeName).filter(searchTerms);
            console.log("INFO: search terms are " + JSON.stringify(searchTerms));
            console.log("INFO: filter URL is " + url);
            $http.get(url).success(function (data) {
                tableOptions.gridOptions.data = data;
            });

        };
        uiElement.setTotalItems = function() {
            var url = EndpointMapping.map(typeName).count();
            $http.get(url).success(function (data) {
                console.log("INFO: totalItems are " + JSON.stringify(data));
                tableOptions.gridOptions.totalItems = data.size;
            });
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
        id: "TypeTable",
        render: function (element, schema, instance, $scope) {

            var tObject = createTableControlObject();
            var tableUiElement = createTypeTableUIElement(element, element.scope.name, instance);

            tableUiElement.registerCallbacks($scope);
            tableUiElement.fetchPagedData();

            tObject.elements.push(tableUiElement);
            BindingService.add(tableUiElement.id, tableUiElement.value);

            return tObject;
        }
    });

    RenderService.register({
        id: "Table",
        render: function (element, schema, instanceData, $scope) {
            var tObject = createTableControlObject();
            var value = DataCommon.getValue(element.feature.path, instanceData);
            var type = DataCommon.getType(element.feature.path, schema);
            if (type.type == "array") {
                // TODO: resolve array.items type and feed into function as 2nd parameter
                var ref = type.items.$ref;
                var typeName = ref.substring(ref.lastIndexOf('/') + 1, ref.length);
                var tableUiElement = createTableUIElement(element, typeName, value, schema);

                tableUiElement.registerCallbacks($scope);
                tableUiElement.fetchPagedData();

                tObject.elements.push(tableUiElement);
                BindingService.add(tableUiElement.id, tableUiElement.value);
                return tObject;
            } else {
                console.log("WARNING: " + element.feature.path + " has not expected type array.")
            }

        }
    });
}]);
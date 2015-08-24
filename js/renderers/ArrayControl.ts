/// <reference path="../../typings/angularjs/angular.d.ts"/>
/// <reference path="../services.ts"/>

class ArrayControl implements jsonforms.services.IRenderer {


    private maxSize = 99;

    priority = 2;

    constructor(private refResolver: jsonforms.services.IReferenceResolver, private scope: ng.IScope) {

    }

    isApplicable(element: IUISchemaElement, subSchema: SchemaElement, schemaPath: string):boolean {
        return element.type == 'Control' && subSchema.type == 'array';
    }

    render(element: IControlObject, subSchema: SchemaElement, schemaPath: string, dataProvider: jsonforms.services.IDataProvider): jsonforms.services.IResult {

        var control = this.createTableUIElement(element,dataProvider);

        dataProvider.fetchData().then(data => {
            control['tableOptions'].gridOptions.data = data;
        });

        return {
            "label": element.label,
            "type": "Control",
            "tableOptions": control['tableOptions'],
            "size": this.maxSize,
            "template": `<div ui-grid="element['tableOptions']"></div>`
    };
    }

    //private resolveColumnData(uiPath, data) {
    //    if (data instanceof Array) {
    //        return data;
    //    } else {
    //        // relative scope
    //        return this.refResolver.resolveUi(data, uiPath);
    //    }
    //}

    private createTableUIElement(element, dataProvider) {

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
                    tableOptions.gridOptions.data = newData; //this.resolveColumnData(path, newData, colDefs);
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
    RenderService.register(new ArrayControl(ReferenceResolver, $rootScope));
}]);
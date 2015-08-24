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
        // init
        control['tableOptions'].gridOptions.data = dataProvider.data.slice(
            dataProvider.page * dataProvider.pageSize,
            dataProvider.page * dataProvider.pageSize + dataProvider.pageSize);
        control['tableOptions'].gridOptions['paginationPage'] = dataProvider.page;
        control['tableOptions'].gridOptions['paginationPageSize'] = dataProvider.pageSize;

        return {
            "label": element.label,
            "type": "Control",
            "gridOptions": control['tableOptions']['gridOptions'],
            "size": this.maxSize,
            //<div ui-grid="control.tableOptions.gridOptions" ui-grid-auto-resize ui-grid-pagination class="grid"></div>

            "template": `<div ui-grid="element['gridOptions']" ui-grid-auto-resize ui-grid-pagination class="grid"></div>`
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

    private createTableUIElement(element, dataProvider: jsonforms.services.IDataProvider) {

        // TODO: how to configure paging/filtering
        var paginationEnabled = dataProvider.fetchPage !== undefined;
        var filteringEnabled = false;

        var uiElement = {
            schemaType: "array"
        };

        var that = this;
        //var prefix = this.refResolver.normalize(parentScope);
        var colDefs = element.columns.map(function(col, idx) {
            return {
                field:  that.refResolver.normalize(col['scope']['$ref']),
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

        if (dataProvider.totalItems) {
            tableOptions['gridOptions']['totalItems'] = dataProvider.totalItems;
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


        tableOptions.gridOptions['onRegisterApi'] = function(gridApi) {
            //gridAPI = gridApi;
            gridApi.pagination.on.paginationChanged(that.scope, function (newPage, pageSize) {
                tableOptions.gridOptions['paginationPage'] = newPage;
                tableOptions.gridOptions['paginationPageSize'] = pageSize;
                dataProvider.setPageSize(pageSize);
                dataProvider.fetchPage(newPage, pageSize).then(newData => {
                    tableOptions.gridOptions.data = newData;
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
/// <reference path="../../typings/angularjs/angular.d.ts"/>
/// <reference path="../../typings/ui-grid/ui-grid.d.ts"/>
/// <reference path="../../typings/schemas/uischema.d.ts"/>
/// <reference path="../services.ts"/>

class ArrayControl implements JSONForms.IRenderer {

    constructor(private pathResolver: JSONForms.IPathResolver, private scope: ng.IScope) {

    }

    private defaultGridOptions(services: JSONForms.Services, schema: SchemaElement): uiGrid.IGridOptions {

        var paginationEnabled = false;
        var defaultGridOptions:uiGrid.IGridOptions = {};
        defaultGridOptions.enableColumnResizing = true;
        defaultGridOptions.enableHorizontalScrollbar = 0;
        defaultGridOptions.enableVerticalScrollbar = 0;
        var dataProvider = services.get<JSONForms.IDataProvider>(JSONForms.ServiceId.DataProvider);
        var validationService = services.get<JSONForms.IValidationService>(JSONForms.ServiceId.Validation);

        if (dataProvider instanceof JSONForms.DefaultInternalDataProvider) {
            defaultGridOptions.totalItems = dataProvider.getTotalItems();
        } else {

            paginationEnabled = dataProvider.fetchPage !== undefined;

            if (paginationEnabled) {
                // disable internal and enable external pagination
                defaultGridOptions.enablePagination = false;
                defaultGridOptions.useExternalPagination = true;
                defaultGridOptions.paginationPageSizes = [5, 10, 20];
                defaultGridOptions.paginationPageSize = 5;
                defaultGridOptions.paginationCurrentPage = 1;
                defaultGridOptions.enablePaginationControls = true;
            }

            // TODO: implement filtering and pass grid options accordingly
            //if (filteringEnabled) {
            //    defaultGridOptions.enableFiltering = false;
            //    defaultGridOptions.useExternalPagination = true;
            //}
        }

        defaultGridOptions.onRegisterApi = (gridApi) => {
            if  (paginationEnabled) {
                gridApi.pagination.on.paginationChanged(this.scope, (newPage, pageSize) => {
                    defaultGridOptions.paginationCurrentPage = newPage;
                    defaultGridOptions.paginationPageSize = pageSize;
                    dataProvider.setPageSize(pageSize);
                    dataProvider.fetchPage(newPage, pageSize).then(newData => {
                        defaultGridOptions.data = newData;
                    });
                });
            }
            gridApi.edit.on.afterCellEdit(this.scope, (rowEntity, colDef: uiGrid.IColumnDef, newValue, oldValue) => {
                var value = newValue;

                // TODO: newValue is a string?
                if (colDef.type) {
                    if (colDef.type == "number" || colDef.type == "integer") {
                        value = Number(newValue);
                    } else if (colDef.type == "boolean") {
                        value = Boolean(newValue);
                    }
                }

                rowEntity[colDef.field] = value;
                validationService.validate(rowEntity, schema['items']);
                // TODO: use constant
                gridApi.core.notifyDataChange("column");
                this.scope.$apply();
            });

        };

        return defaultGridOptions;
    }

    private maxSize = 99;
    priority = 2;

    isApplicable(element: IUISchemaElement, subSchema: SchemaElement, schemaPath: string):boolean {
        return element.type == 'Control' && subSchema.type == 'array';
    }

    render(element: IArrayControlObject, schema: SchemaElement, schemaPath: string, services: JSONForms.Services): JSONForms.IArrayControlRenderDescription {

        var gridOptions: uiGrid.IGridOptions = this.createGridOptions(element, services, schema, schemaPath);
        let data = services.get<JSONForms.IDataProvider>(JSONForms.ServiceId.DataProvider).getData();

        if (!Array.isArray(data)) {
            data = this.pathResolver.resolveInstance(data, schemaPath);
        }

        if (data != undefined) {
            gridOptions.data = data
        }

        return {
            "type": "Control",
            "gridOptions": gridOptions,
            "size": this.maxSize,
            "template": `<control><div ui-grid="element['gridOptions']" ui-grid-auto-resize ui-grid-pagination ui-grid-edit class="grid"></div></control>`
        };
    }

    private createColumnDefs(element: IArrayControlObject, schema: SchemaElement, services: JSONForms.Services): uiGrid.IColumnDef[] {
        let validationService: JSONForms.IValidationService = services.get<JSONForms.IValidationService>(JSONForms.ServiceId.Validation);
        return element.columns.map((col) => {
            var subSchema: SchemaElement = this.pathResolver.resolveSchema(schema, col['scope']['$ref']);
            return {
                field: this.pathResolver.toInstancePath(col['scope']['$ref']),
                displayName: col.label,
                enableCellEdit: true,
                type: subSchema.type,
                cellClass: (grid, row, col)=> {
                    let result = validationService.getResult(row.entity, '/' + col.colDef.field);
                    if (result != undefined) {
                        return 'invalidCell';
                    } else {
                        return 'validCell';
                    }
                }
            };
        });
    }

    private generateColumnDefs(subSchema: SchemaElement): uiGrid.IColumnDef[] {
        var items = subSchema['items'];
        var colDefs = [];
        // TODO: items
        if (items['type'] == 'object') {
            for (var prop in items['properties']) {
                if (items['properties'].hasOwnProperty(prop)) {
                    colDefs.push({
                        field: prop,
                        displayName: JSONForms.PathUtil.beautify(prop),
                    });
                }
            }
        } else {
            // TODO: array containing primitive type
        }
        return colDefs;
    }

    private createGridOptions(element: IArrayControlObject, services: JSONForms.Services, schema: SchemaElement, schemaPath: string) {

        var colDefs: uiGrid.IColumnDef[];
        var subSchema = this.pathResolver.resolveSchema(schema, schemaPath);

        if (element.columns) {
            colDefs = this.createColumnDefs(element, subSchema, services);
        } else {
            colDefs = this.generateColumnDefs(subSchema);
        }

        var defaultGridOptions: uiGrid.IGridOptions = this.defaultGridOptions(services, schema);
        var gridOptions: uiGrid.IGridOptions = element.options || {};
        for (var option in defaultGridOptions) {
            if (defaultGridOptions.hasOwnProperty(option)) {
                gridOptions[option] = defaultGridOptions[option];
            }
        }

        gridOptions.columnDefs = colDefs;
        return gridOptions;
    }

    findSearchTerms(grid) {
        var searchTerms = [];
        for (var i = 0; i < grid.columns.length; i++) {
            var searchTerm = grid.columns[i].filters[0].term;
            if (searchTerm !== undefined && searchTerm !== null) {
                searchTerms.push({
                    column: grid.columns[i].getName,
                    term: searchTerm
                });
            }
        }

        return searchTerms;
    }
}

var app = angular.module('jsonforms.arrayControl', []);

app.run(['RenderService', 'PathResolver', '$rootScope', (RenderService, PathResolver, $rootScope) => {
    RenderService.register(new ArrayControl(PathResolver, $rootScope));
}]);

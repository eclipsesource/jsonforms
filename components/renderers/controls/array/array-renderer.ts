///<reference path="../../../references.ts"/>

class ArrayRenderer implements JSONForms.IRenderer {

    private maxSize = 99;
    priority = 2;

    constructor(private pathResolver: JSONForms.IPathResolver) {

    }

    private static isExternalFilterAvailable(dataProvider: JSONForms.IDataProvider,
                                             options: uiGrid.IGridOptions): boolean {
        return dataProvider.filter !== undefined &&
            options.hasOwnProperty('useExternalFiltering');
    }

    private static isExternalPagingAvailable(dataProvider: JSONForms.IDataProvider,
                                             options: uiGrid.IGridOptions) {
        return dataProvider.fetchPage !== undefined &&
                options.hasOwnProperty('useExternalPagination');
    }

    private defaultGridOptions(existingOptions: uiGrid.IGridOptions,
                               services: JSONForms.Services, schema: SchemaElement): uiGrid.IGridOptions {

        var dataProvider = services.get<JSONForms.IDataProvider>(JSONForms.ServiceId.DataProvider);
        var validationService = services.get<JSONForms.IValidationService>(JSONForms.ServiceId.Validation);
        var scope = services.get<JSONForms.IScopeProvider>(JSONForms.ServiceId.ScopeProvider).getScope();

        let externalPaginationEnabled = ArrayRenderer.isExternalPagingAvailable(dataProvider, existingOptions);
        let externalFilteringEnabled  = ArrayRenderer.isExternalFilterAvailable(dataProvider, existingOptions);

        var defaultGridOptions:uiGrid.IGridOptions = {};
        defaultGridOptions.totalItems = dataProvider.getTotalItems();
        defaultGridOptions.enableColumnResizing = true;
        defaultGridOptions.enableHorizontalScrollbar = 0;
        defaultGridOptions.enableVerticalScrollbar = 0;
        defaultGridOptions.paginationPageSizes = [5, 10, 20];
        defaultGridOptions.paginationPageSize = 5;
        defaultGridOptions.paginationCurrentPage = 1;
        defaultGridOptions.enablePaginationControls = true;

        if (externalPaginationEnabled) {
            defaultGridOptions.useExternalPagination = true;
        }

        defaultGridOptions.onRegisterApi = (gridApi) => {
            if (externalPaginationEnabled) {
                gridApi.pagination.on.paginationChanged(scope, (newPage, pageSize) => {
                    defaultGridOptions.paginationCurrentPage = newPage;
                    defaultGridOptions.paginationPageSize = pageSize;
                    dataProvider.setPageSize(pageSize);
                    dataProvider.fetchPage(newPage).then(newData => {
                        existingOptions.data = newData;
                    });
                });
            }
            if (externalFilteringEnabled) {
                gridApi.core.on.filterChanged(scope, () => {
                    var columns = gridApi.grid.columns;
                    var terms = columns.reduce((acc, column) => {
                        var value: any = column.filters[0].term;
                        if (value !== undefined && value.length > 0) {
                            acc[column.field] = ArrayRenderer.convertColumnValue(column.colDef, value);
                        }
                        return acc;
                    }, {});
                    dataProvider.filter(terms).then(newData => {
                        existingOptions.data = newData;
                    })
                });
            }
            gridApi.edit.on.afterCellEdit(scope, (rowEntity, colDef:uiGrid.IColumnDef, newValue, oldValue) => {
                rowEntity[colDef.field] = ArrayRenderer.convertColumnValue(colDef, newValue);
                validationService.validate(rowEntity, schema['items']);
                // TODO: use constant
                gridApi.core.notifyDataChange("column");
                scope.$apply();
            });
        };

        return this.mergeOptions(existingOptions, defaultGridOptions);
    }

    private static convertColumnValue(colDef: uiGrid.IColumnDef, value: string): any {
        if (colDef.type) {
            if (colDef.type == "number" || colDef.type == "integer") {
               return Number(value);
            } else if (colDef.type == "boolean") {
                return Boolean(value);
            }
        }

        return value;
    }

    private mergeOptions(optionsA: any, optionsB: any): any {
        return Object.keys(optionsB).reduce((mergedOpts, optionName) => {
            if (mergedOpts.hasOwnProperty(optionName)) {
                return mergedOpts
            }
            mergedOpts[optionName] = optionsB[optionName];
            return mergedOpts;
        }, optionsA);
    }

    isApplicable(element: IUISchemaElement, subSchema: SchemaElement, schemaPath: string):boolean {
        return element.type == 'Control' && subSchema !== undefined && subSchema.type == 'array';
    }

    render(element: IArrayControlObject, schema: SchemaElement, schemaPath: string, services: JSONForms.Services): JSONForms.IArrayControlRenderDescription {

        var gridOptions: uiGrid.IGridOptions = this.createGridOptions(element, services, schema, schemaPath);
        var data = services.get<JSONForms.IDataProvider>(JSONForms.ServiceId.DataProvider).getData();

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

    private generateColumnDefs(schema: SchemaElement, schemaPath: string): any {
        var columnsDefs = [];
        var subSchema = this.pathResolver.resolveSchema(schema, schemaPath);
        var items = subSchema['items'];
        // TODO: items
        if (items['type'] == 'object') {
            for (var prop in items['properties']) {
                if (items['properties'].hasOwnProperty(prop)) {
                    var colDef = {
                        field: prop,
                        displayName: JSONForms.PathUtil.beautify(prop)
                    };
                    columnsDefs.push(colDef);
                }
            }
        } else {
            // TODO is this case even possible (array containing primitive type)?
        }

        return columnsDefs;
    }

    private createColumnDefs(columns: IColumnControlObject[], schema: SchemaElement, services: JSONForms.Services): uiGrid.IColumnDef[] {
        var validationService:JSONForms.IValidationService = services.get<JSONForms.IValidationService>(JSONForms.ServiceId.Validation);

        return columns.map((col) => {
            var href = col['href'];
            if (href) {
                var hrefScope = href.scope;
                var cellTemplate;
                var field = this.pathResolver.toInstancePath(col['scope']['$ref']);

                if (hrefScope) {
                    var instancePath = this.pathResolver.toInstancePath(hrefScope.$ref);
                    cellTemplate = `<div class="ui-grid-cell-contents">
                      <a href="#${href.url}/{{row.entity.${instancePath}}}">
                        {{row.entity.${field}}}
                      </a>
                    </div>`;
                } else {
                    cellTemplate = `<div class="ui-grid-cell-contents">
                      <a href="#${href.url}/{{row.entity.${field}}}">
                        {{row.entity.${field}}}
                      </a>
                </div>`;
                }

                return {
                    cellTemplate: cellTemplate,
                    field: field,
                    displayName: col.label,
                    enableCellEdit: false
                };
            } else {
                var subSchema:SchemaElement = this.pathResolver.resolveSchema(schema, col['scope']['$ref']);
                return {
                    field: this.pathResolver.toInstancePath(col['scope']['$ref']),
                    displayName: col.label,
                    enableCellEdit: true,
                    type: subSchema.type,
                    cellClass: (grid, row, col)=> {
                        var result = validationService.getResult(row.entity, '/' + col.colDef.field);
                        if (result != undefined) {
                            return 'invalidCell';
                        } else {
                            return 'validCell';
                        }
                    }
                };
            }
        });
    }

    private createGridOptions(element: IArrayControlObject, services: JSONForms.Services, schema: SchemaElement, schemaPath: string) {

        var subSchema = this.pathResolver.resolveSchema(schema, schemaPath);

        var columnsDefs: uiGrid.IColumnDef[] = element.columns ?
            this.createColumnDefs(element.columns, subSchema, services) :
            this.generateColumnDefs(subSchema, schemaPath);

        var gridOptions: uiGrid.IGridOptions = this.defaultGridOptions(element.options || {}, services, schema);
        gridOptions.columnDefs = columnsDefs;
        return gridOptions;
    }
}

angular.module('jsonforms.renderers.controls.array').run(['RenderService', 'PathResolver', function(RenderService, PathResolver) {
    RenderService.register(new ArrayRenderer(PathResolver));
}]);

///<reference path="..\services.ts"/>

class DatetimeControl implements jsonforms.services.IRenderer {

    priority = 3;

    constructor(private refResolver: jsonforms.services.IReferenceResolver) { }

    render(element: IUISchemaElement, subSchema: SchemaElement, schemaPath: string, dataProvider: jsonforms.services.IDataProvider): jsonforms.services.IResult {
        //var path = this.refResolver.normalize(this.refResolver.getSchemaRef(uiPath));
        var options = {
            "type": "Control",
            "size": 99,
            "label": element['label'],
            "path": [this.refResolver.normalize(schemaPath)],
            "instance": dataProvider.data,
            "isOpen": false,
            // TODO: pefix
            "templateUrl": '../templates/datetime.html',
            openDate: function($event) {
                $event.preventDefault();
                $event.stopPropagation();
                options.isOpen = true;
            }
        };
        return options;
    }

    isApplicable(uiElement: IUISchemaElement, subSchema: SchemaElement, schemaPath: string): boolean {
        return uiElement.type == 'Control' && subSchema.type == "string" &&
            subSchema['format'] != undefined && subSchema['format'] == "date-time";
    }
}

var app = angular.module('jsonForms.datetimeControl', []);

app.run(['RenderService', 'ReferenceResolver', '$rootScope', function(RenderService, ReferenceResolver, $scope) {
    RenderService.register(new DatetimeControl((ReferenceResolver)));
}]);
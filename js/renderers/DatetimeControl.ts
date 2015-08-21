///<reference path="..\services.ts"/>

class DatetimeControl implements jsonforms.services.IRenderer {

    priority = 3;

    constructor(private refResolver: jsonforms.services.IReferenceResolver) { }

    render(element:jsonforms.services.UISchemaElement, schema, instance, uiPath: string, dataProvider) {
        var path = this.refResolver.normalize(this.refResolver.getSchemaRef(uiPath));
        var options = {
            "type": "Control",
            "size": 99,
            "id": path,
            "path": path,
            "label": element['label'],
            "instance": instance,
            "isOpen": false,
            "templateUrl": '../templates/datetime.html',
            openDate: function($event) {
                $event.preventDefault();
                $event.stopPropagation();
                options.isOpen = true;
            }
        };
        return options;
    }

    isApplicable(uiElement: IUISchemaElement, jsonSchema: SchemaElement, schemaPath: string): boolean {
        var subSchema: SchemaString = this.refResolver.resolveSchema(jsonSchema, schemaPath);
        if (subSchema == undefined) {
            return false;
        }
        return uiElement.type == 'Control' && subSchema.type == "string" &&
            subSchema.format != undefined && subSchema.format == "date-time";
    }
}

var app = angular.module('jsonForms.datetimeControl', []);

app.run(['RenderService', 'ReferenceResolver', '$rootScope', function(RenderService, ReferenceResolver, $scope) {
    RenderService.register(new DatetimeControl((ReferenceResolver)));
}]);
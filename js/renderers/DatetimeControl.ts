///<reference path="..\services.ts"/>

class DatetimeControl implements jsonforms.services.IRenderer {

    priority = 3;

    constructor(private refResolver: jsonforms.services.IReferenceResolver) { }

    render(element:jsonforms.services.UISchemaElement, schema, instance, uiPath: string, dataProvider) {
        var path = this.refResolver.normalize(this.refResolver.get(uiPath));
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

    isApplicable(element:jsonforms.services.UISchemaElement):boolean {
        if (element.hasOwnProperty('scope')) {
            return element['scope'].type === "string" && element['scope'].format !== undefined
                && element['scope'].format === "date-time";
        }
        return false;
    }
}

var app = angular.module('jsonForms.datetimeControl', []);

app.run(['RenderService', 'ReferenceResolver', '$rootScope', function(RenderService, ReferenceResolver, $scope) {
    RenderService.register(new DatetimeControl((ReferenceResolver)));
}]);
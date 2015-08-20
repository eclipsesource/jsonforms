///<reference path="..\services.ts"/>

class StringControl implements jsonforms.services.IRenderer {

    priority = 2;

    constructor(private refResolver: jsonforms.services.IReferenceResolver) { }

    render(element:jsonforms.services.UISchemaElement, schema, instance, uiPath: string, dataProvider) {
        var path = this.refResolver.normalize(this.refResolver.get(uiPath));
        var id = path;
        return {
            "type": "Control",
            "size": 99,
            "id": id,
            "path": path,
            "label": element['label'],
            "instance": instance,
            "template": `<input type="text" id="${id}" class="form-control qb-control qb-control-string" data-jsonforms-model/>`
        };
    }

    isApplicable(element:jsonforms.services.UISchemaElement):boolean {
        if (element.hasOwnProperty('scope')) {
            return element['scope'].type === "string";
        }
        return false;
    }
}

var app = angular.module('jsonForms.stringControl', []);

app.run(['RenderService', 'ReferenceResolver', function(RenderService, ReferenceResolver) {
    RenderService.register(new StringControl((ReferenceResolver)));
}]);
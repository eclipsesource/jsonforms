/// <reference path="../../typings/angularjs/angular.d.ts"/>
/// <reference path="../services.ts"/>

class ControlRenderer implements jsonforms.services.IRenderer {

    priority = 1;

    constructor(private refResolver: jsonforms.services.IReferenceResolver) { }

    render(element:jsonforms.services.UISchemaElement, schema, instance, path: string, dataProvider) {

        var control = {};
        control["schemaType"] = element['scope']['type'];
        control["bindings"] = instance;
        control["path"] = this.refResolver.normalize(this.refResolver.get(path));
        control["label"] = element['label'];
        // TODO: create unique ID?
        control["id"] = path;

        return {
            "type": "Control",
            "elements": [control],
            "size": 99 // TODO
        };
    }

    isApplicable(element:jsonforms.services.UISchemaElement):boolean {
        return element.type == "Control"
    }
}

var app = angular.module('jsonForms.control', []);

app.run(['RenderService', 'ReferenceResolver', function(RenderService, ReferenceResolver) {
    RenderService.register(new ControlRenderer((ReferenceResolver)));
}]);
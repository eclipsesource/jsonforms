var app = angular.module('makeithappen');
app.run(['RenderService', 'ReferenceResolver', function(RenderService, ReferenceResolver) {

    function MyControl(refResolver) {

        return {
            priority: 100,
            render: function(element, schema, instance, uiPath, dataProvider) {

                var path = refResolver.normalize(refResolver.getSchemaRef(uiPath));
                var id = path;

                return {
                    "type": "Control",
                    "size": 99,
                    "id": id,
                    "path": path,
                    "instance": instance,
                    "label": 'My Custom Control',
                    "template": '<input type="text" style="background-color: greenyellow" id="element.id" class="form-control qb-control qb-control-string" data-jsonforms-model/>'
                };
            },

            isApplicable: function (element, jsonSchema, schemaPath) {
                if (element.hasOwnProperty('scope')) {
                    return element.scope.type == "string" && schemaPath === "#/properties/firstName";
                }
                return false;
            }
        }
    }

    RenderService.register(new MyControl(ReferenceResolver));
}]);
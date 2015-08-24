var app = angular.module('makeithappen');
app.run(['RenderService', 'ReferenceResolver', function(RenderService, ReferenceResolver) {

    function MyControl(refResolver) {

        return {
            priority: 100,
            render: function(element, subSchema, schemaPath, dataProvider) {
                return {
                    "type": "Control",
                    "size": 99,
                    "id": schemaPath,
                    "path": [refResolver.normalize(schemaPath)],
                    "instance": dataProvider.data,
                    "label": 'My Custom Control',
                    "template": '<input type="text" style="background-color: greenyellow" id="element.id" class="form-control qb-control qb-control-string" data-jsonforms-model/>'
                };
            },

            isApplicable: function (element, subSchema, schemaPath) {
                if (element.hasOwnProperty('scope')) {
                    return subSchema.type == "string" && schemaPath === "#/properties/firstName";
                }
                return false;
            }
        }
    }

    RenderService.register(new MyControl(ReferenceResolver));
}]);
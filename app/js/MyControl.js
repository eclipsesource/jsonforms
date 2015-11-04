var app = angular.module('makeithappen');
app.run(['RenderService', function(RenderService) {

    function MyControl() {

        return {
            priority: 100,
            render: function(element, schema, schemaPath, services) {
                var control = new JSONForms.ControlRenderDescription(dataProvider.data, schemaPath);
                control['template'] = '<control><input type="text" style="background-color: #3278b3; color: #8dd0ff" class="jsf-control-string jsf-control form-control" data-jsonforms-model data-jsonforms-validation /></control>'
                return control;
            },

            isApplicable: function (element, subSchema, schemaPath) {
                return element.type == "Control" && schemaPath.endsWith("firstName");
            }
        }
    }

    RenderService.register(new MyControl());
}]);
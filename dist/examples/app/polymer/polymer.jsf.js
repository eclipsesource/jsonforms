var app = angular.module('makeithappen');
app.run(['RendererService', 'PathResolver', '$rootScope', function(RenderService, PathResolver, $rootScope) {

    // function PolymerControl() {
    //
    //     var instance;
    //     var path;
    //
    //     // set-up event binding
    //     document.addEventListener('WebComponentsReady', function() {
    //         var input = document.querySelector('paper-input');
    //         if (input) {
    //             input.addEventListener('keyup', function () {
    //                 instance[path] = input.value;
    //                 $rootScope.$digest();
    //             });
    //         }
    //     });
    //
    //     return {
    //         priority: 100,
    //         render: function(element, schema, schemaPath, services) {
    //             var control = JSONForms.RenderDescriptionFactory.createControlDescription(schemaPath, services, element);
    //             var data = services.get(JSONForms.ServiceId.DataProvider).getData();
    //             path = PathResolver.toInstancePath(schemaPath);
    //             instance = data;
    //             control['template'] =
    //                 '<div class="panel panel-default">' +
    //                 '<paper-input type="text" value="{{element.instance[\'' + path + '\']}}" data-jsonforms-model label="Last name goes here"></paper-input>' +
    //                 '</div>';
    //             return control;
    //         },
    //
    //         isApplicable: function (element, subSchema, schemaPath) {
    //             return element.type == "Control" && schemaPath != undefined && schemaPath.endsWith("lastName");
    //         }
    //     }
    // }
    //
    // RenderService.regi
}]);